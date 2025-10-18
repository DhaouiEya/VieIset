// services/emailService.js

const nodemailer = require('nodemailer');

// Immediately create a transporter if config is present
let transporter;
if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email configuration is missing. Emails will not be sent.');
} else {
    transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
}

/**
 * Send an email using the configured transporter.
 * @param {Object} options
 * @param {string|string[]} options.to - Receiver email address(es).
 * @param {string} options.subject - Subject of the email.
 * @param {string} options.html - HTML body of the email.
 * @param {string} [options.from] - Optional from address (defaults to config). 
 * @returns {Promise<void>}
 */
async function sendEmail({ to, subject, html, from }) {
    if (!transporter) {
        console.warn('Cannot send email: transporter is not configured.');
        return;
    }

    const mailOptions = {
        from: from || `"Facturation" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.error('Failed to send email:', err);
        throw err;
    }
}

module.exports = {
    sendEmail,
};
