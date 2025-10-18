const User = require('../models/etudiant');
const validateRequiredFields=require("../utils/validators")
const { sendEmail } = require('../services/emailService');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require('jsonwebtoken');


exports.register = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,

        } = req.body;


        const requiredFields = ['firstName','lastName','email' , 'password'];

        const validationError = validateRequiredFields(req.body, requiredFields);
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: "Certains champs obligatoires sont manquants.",
                errors: validationError
            });
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

         // Generate verification tokens
        const emailVerificationToken = generateToken();
        const tokenExpiry = Date.now() + 3600000; // 1 hour

     

    

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: 'memebre',
            emailVerificationToken,
            emailVerificationExpires: tokenExpiry,
        });

            // Send verification email
        await sendVerificationEmail(user, req, next);




        // // Generate JWT token for immediate login if needed
        // const authToken = jwt.sign(
        //     { _id: user._id, role: user.role },
        //     process.env.JWT_SECRET,
        //     { expiresIn: '7d' }
        // );

        res.status(201).json({
            success: true,
            message: 'Registration successful. Verification email link  sent.',
            // authToken
        });

    } catch (error) {
        next(error);
    }
};



const sendVerificationEmail = async (user, req, next) => {
    try {
        // Lien de vérification pour Vie Étudiante ISET
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${user.emailVerificationToken}`;

        // En-tête de l'email
        const header = `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;
                        padding:20px;text-align:center;background:#f5f5f5;">
                <img src="${process.env.LOGO_URL}"
                     alt="Vie Étudiante ISET"
                     style="max-height:60px;">
            </div>
        `;

        // Pied de page de l'email
        const footer = `
            <footer style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;
                           padding:20px;text-align:center;color:#666;font-size:12px;">
                <p>© ${new Date().getFullYear()} Vie Étudiante ISET. 
                   <a href="${process.env.FRONTEND_URL}/auth/login">Se connecter</a>
                </p>
            </footer>
        `;

        // Corps de l'email
        const body = `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;
                        padding:20px;">
                <h1>Confirme ton adresse email</h1>
                <p>Salut ${user.firstName || 'Étudiant'},</p>
                <p>
                    Pour finaliser ton inscription sur Vie Étudiante ISET, 
                    clique sur le bouton ci-dessous pour vérifier ton adresse email.
                    Ce lien expirera dans 1 heure.
                </p>
                <div style="text-align:center;margin:20px 0;">
                    <a href="${verificationLink}"
                       style="display:inline-block;padding:10px 20px;
                              background:#6935EB;color:#fff;text-decoration:none;
                              border-radius:5px;">
                        Vérifier mon email
                    </a>
                </div>
                <p>Si tu n'as pas créé de compte, ignore simplement cet email.</p>
            </div>
        `;

        // Envoi de l'email
        await sendEmail({
            to: user.email,
            subject: `Vie Étudiante ISET: Vérification de ton email`,
            html: header + body + footer
        });

    } catch (err) {
        console.error('sendVerificationEmail error:', err);
        next(err);
    }
};



exports.verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.json({
                success: false,
                message: 'Invalid or expired token.'
            });
        }
       
        // Verify the user's email
        user.isActive=true;
        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;

        await user.save();
        return res.json({
            success: true,
            message: 'E-mail vérifié avec succès.'
        });
    }
    catch (error) {
        next(error); 
    }
};




exports.resendVerificationEmail = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

    
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur introuvable.'
            });
        }

        if (user.emailVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email already verified.'
            });
        }

        // Generate new token and update expiration
        user.emailVerificationToken = generateToken();
        user.emailVerificationExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        await sendVerificationEmail(user, req, next);

        return res.json({
            success: true,
            message: 'Verification email resent.'
        });
    }
    catch (error) {
        next(error); // Pass the error to the middleware
    }
};



exports.googleLogin = async (req, res, next) => {
    const { idToken, keepmeloggedin } = req.body;

    try {
        // Verify the Google ID token
        const ticket = await googleClient.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, email_verified, name } = payload;

        // First check for existing user with googleId
        let user = await User.findOne({ googleId });

        if (!user) {
            // Check if email exists
            const existingEmailUser = await User.findOne({ email });

            if (existingEmailUser) {
                if (email_verified) {
                    // Link accounts if email is verified
                    existingEmailUser.googleId = googleId;
                    existingEmailUser.emailVerified = true;
                    if (!existingEmailUser.profilePicture) {
                        existingEmailUser.profilePicture = picture;
                    }
                    user = existingEmailUser;
                } else {
                    return res.status(400).json({
                        success: false,
                        message: 'E-mail déjà enregistré avec une méthode différente.'
                    });
                }
            } else {
                // Create new user
                user = new User({
                    role: 'memebre',
                    googleId,
                    email,
                    firstName: name?.split(' ')[0] || '',
                    lastName: name?.split(' ').slice(1).join(' ') || '',
                    emailVerified: email_verified,
                    isActive: true,
                });
            }
        }

    
        // Generate JWT token
        const authToken = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: keepmeloggedin ? '7d' : '1d' }
        );

        // Generate refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');
        user.refreshToken = refreshToken;

        // Save user changes
        await user.save();

        // Log successful login
        console.log(`Google login successful for user ${user._id} at ${new Date().toISOString()}`);
        // Return success response
        res.json({
            success: true,
            authToken,
            refreshToken,
            
            etudiant: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        console.error('Google login error:', error);

        // Handle specific errors
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Google token expired'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid Google token'
            });
        }

        next(error);
    }
};


exports.infos = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const updates = req.body; // Les champs envoyés pour pré-inscription

        // Exemple : les champs obligatoires pour pré-inscription
        const requiredFields = ['address'];

        const validationError = validateRequiredFields(updates, requiredFields);
        if (validationError) {
            return res.status(400).json({
                success: false,
                message: 'Certains champs obligatoires sont manquants.',
                errors: validationError
            });
        }

        // Vérifier que l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Utilisateur introuvable'
            });
        }

        // Mettre à jour les informations de l'utilisateur
        Object.keys(updates).forEach(key => {
            user[key] = updates[key];
        });

        user.preRegistered = true; // Marquer comme pré-inscrit

        await user.save();

        res.json({
            success: true,
            message: 'Informations mises à jour avec succès',
            user
        });
    } catch (error) {
        next(error);
    }
};


exports.me = async (req, res, next) => {
    try {
        const _id = req.user._id;

        const user = await User.findOne({ _id });

        if (!user) {
            return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
        }

        // Respond with the user's details and additional fields
        res.json({ success: true, ...user.toObject() });

    } catch (error) {
        next(error); // Pass the error to the middleware
    }
};
