const User = require('../models/etudiant');




exports.register = async (req, res, next) => {
    try {
        const {
            phone,
            email,
            password,
        } = req.body;


        const requiredFields = ['email', 'password', 'phone'];

        const validationError = validateRequiredFields(req.body, requiredFields, fieldTranslations);
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: "Certains champs obligatoires sont manquants.",
                errors: validationError
            });
        }

        const phoneverified = await User.findOne({ phone: phone });
        if (phoneverified) {
            if (phoneverified.phoneVerified === false && phoneverified.isActive === false) {
                await User.deleteOne({ _id: phoneverified._id });   // Supprimer l'utilisateur existant "inactif et non vérifié"
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Phone already in use'
                });
            }
        }

        // Check if email already exists
        const existingUserEmail = await User.findOne({ email: email.toLowerCase() });
        if (existingUserEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email already in use'
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);



        // Générer token email
        // const emailVerificationToken = generateToken();
        // const tokenExpiry = Date.now() + 3600000; // 1h



        // Create user
        const user = await User.create({
            firstName,
            lastName,
            country,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
            role: 'user',
            // emailVerificationToken,
            // emailVerificationExpires: tokenExpiry,
            added_by: null // Self-registered
        });



        // Send verification email
        // await sendVerificationEmail(user, req, next);

        // Envoi du code de vérification par SMS via ta fonction dédiée
        if (phone) {
            await sendPhoneVerificationCode(user);
        }

        // Generate JWT token for immediate login if needed
        const authToken = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful. Verification code  sent.',
            authToken,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                country: user.country,
                email: user.email,
                phone: user.phone,
                role: user.role,
                emailVerified: user.emailVerified,
                phoneVerified: user.phoneVerified,
                isActive: user.isActive,
            }
        });

    } catch (error) {
        next(error);
    }
};
