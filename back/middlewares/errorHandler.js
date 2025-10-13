const fs = require('fs').promises;
const path = require('path');

// Create logs directory asynchronously
const logsDir = path.join(__dirname, 'logs');
(async () => {
    try {
        await fs.mkdir(logsDir, { recursive: true }); // // Create logs directory if it doesn't exist
    } catch (err) {
        console.error('Error creating logs directory:', err);
    }
})();

/**
 * Error types with associated severity levels
 */
const ERROR_TYPES = {
    VALIDATION: { code: 'VALIDATION_ERROR', severity: 'warning' },
    DUPLICATE: { code: 'DUPLICATE_ERROR', severity: 'warning' },
    AUTHENTICATION: { code: 'AUTHENTICATION_ERROR', severity: 'warning' },
    AUTHORIZATION: { code: 'AUTHORIZATION_ERROR', severity: 'danger' },
    NOT_FOUND: { code: 'NOT_FOUND_ERROR', severity: 'warning' },
    SERVER: { code: 'SERVER_ERROR', severity: 'danger' },
    CUSTOM: { code: 'CUSTOM_ERROR', severity: 'warning' },
    INFO: { code: 'INFO', severity: 'success' }
};

/**
 * HTTP Status codes mapping
 */
const HTTP_STATUS = {
    VALIDATION: 400,
    DUPLICATE: 409,
    AUTHENTICATION: 401,
    AUTHORIZATION: 403,
    NOT_FOUND: 404,
    SERVER: 500,
    CUSTOM: 400,
    INFO: 200
};

/**
 * Logs error details to a file
 * @param {Error} error - The error object
 * @param {Object} req - Express request object
 */

// enregistre les erreurs dans un fichier journal (log) quotidien

const logErrorToFile = async (error, req) => {
    try {
        const timestamp = new Date().toISOString();
        const errorLog = {
            timestamp,
            method: req?.method,
            url: req?.originalUrl,
            ip: req?.ip,
            userId: req?.user?.id,
            language: req?.headers['accept-language'],
            errorName: error.name,
            errorType: error.type?.code || 'Unknown',
            severity: error.type?.severity || 'danger',
            errorCode: error.code,
            errorMessage: error.message,
            stack: process.env.NODE_ENV !== 'production' ? error.stack : undefined,
            keyValue: error.keyValue,
            errors: error.errors
        };

        const today = new Date().toISOString().split('T')[0];
        const logFilePath = path.join(logsDir, `errors-${today}.log`);

        await fs.appendFile(
            logFilePath,
            JSON.stringify(errorLog, null, 2) + ',\n'
        );
    } catch (err) {
        console.error('Error writing to log file:', err);
    }
};



/**
 * Processes and formats error for response
 * @param {Error} error - The error object
 * @param {string} language - Language code
 * @returns {Object} Formatted error response
 */
const formatError = (error, language) => {
    // Custom errors with predefined type
    if (error.type && ERROR_TYPES[error.type]) {
        return {
            type: ERROR_TYPES[error.type],
            status: error.status || HTTP_STATUS[error.type],
            message: error.message,
            // message: error.message || translate(language, 'errors.default'),
            details: error.details || null
        };
    }

    // MongoDB duplicate key error
    // if (error.code === 11000) {
    //     const duplicateField = Object.keys(error.keyValue)[0];
    //     const duplicateValue = error.keyValue[duplicateField];
    //     const fieldName = getFieldName(language, duplicateField);

    //     return {
    //         type: ERROR_TYPES.DUPLICATE,
    //         status: HTTP_STATUS.DUPLICATE,
    //         message: translate(language, 'errors.unique', { field: fieldName, value: duplicateValue }),
    //         details: { field: duplicateField, value: duplicateValue }
    //     };
    // }

    // Mongoose validation error
    // if (error.name === 'ValidationError') {
    //     const details = formatValidationErrors(error, language);

    //     return {
    //         type: ERROR_TYPES.VALIDATION,
    //         status: HTTP_STATUS.VALIDATION,
    //         message: error.message,

    //         // message: error.message || translate(language, 'errors.validation'),
    //         details
    //     };
    // }

    // JWT authentication errors
    if (error.name === 'JsonWebTokenError') {
        return {
            type: ERROR_TYPES.AUTHENTICATION,
            status: HTTP_STATUS.AUTHENTICATION,
            message: error.message,
            // message: translate(language, 'errors.auth.invalid'),
            details: 'Token invalid'
        };
    }

    if (error.name === 'TokenExpiredError') {
        return {
            type: ERROR_TYPES.AUTHENTICATION,
            status: HTTP_STATUS.AUTHENTICATION,
            message: error.message,

            // message: translate(language, 'errors.auth.expired'),
            details: 'Token expired'
        };
    }

    // Not found errors
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return {
            type: ERROR_TYPES.NOT_FOUND,
            status: HTTP_STATUS.NOT_FOUND,
            message: error.message,

            // message: translate(language, 'errors.notFound'),
            details: `Invalid ID: ${error.value}`
        };
    }

    // Default server error
    return {
        type: ERROR_TYPES.SERVER,
        status: HTTP_STATUS.SERVER,
        message: error.message,

        // message: translate(language, 'errors.server'),
        details: process.env.NODE_ENV !== 'production' ? error.message : undefined
    };
};

/**
 * Creates a custom error with specified type and details
 * @param {string} message - Error message
 * @param {string} type - Error type key from ERROR_TYPES
 * @param {any} details - Additional error details
 * @param {number} status - Optional HTTP status code
 */
const createError = (message, type = 'CUSTOM', details = null, status = null) => {
    const error = new Error(message);
    error.type = type;
    error.details = details;
    error.status = status || HTTP_STATUS[type] || 400;
    return error;
};

/**
 * Global error handling middleware
 */
const errorMiddleware = async (err, req, res, next) => {
    // Log error to console in development
    if (process.env.NODE_ENV !== 'production') {
        console.error('Error:', err);
    }

    // Determine language from request headers
    const acceptLanguage = req.headers['x-preferred-language'] || '';
    const language = acceptLanguage || 'fr';

    // Log detailed error to file
    await logErrorToFile(err, req);

    // Format error for response
    const formattedError = formatError(err, language);

    // Send appropriate response
    res.status(formattedError.status).json({
        success: false,
        error: {
            message: formattedError.message,
            severity: formattedError.type.severity,
            ...(formattedError.details && { details: formattedError.details }),
            ...(process.env.NODE_ENV !== 'production' && {
                type: formattedError.type.code,
                dev: err.message
            })
        }
    });
};

module.exports = {
    errorMiddleware,
    createError,
    ERROR_TYPES: Object.keys(ERROR_TYPES)
};