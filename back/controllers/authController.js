const User = require('../models/user');
const { validateRequiredFields } = require("../utils/validators")
const { sendEmail } = require('../services/emailService');
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwt = require('jsonwebtoken');


function generateToken() {
    // Génère un token aléatoire de 32 octets, puis le convertit en chaîne hexadécimale
    return crypto.randomBytes(32).toString('hex');
}
exports.register = async (req, res, next) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,

        } = req.body;


        const requiredFields = ['firstName', 'lastName', 'email', 'password'];

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
            role: 'membre',
            emailVerificationToken,
            emailVerificationExpires: tokenExpiry,
        });

        // Send verification email
        await sendVerificationEmail(user, req, next);




        // Generate JWT token for immediate login if needed
        const authToken = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'Registration successful. Verification email link  sent.',
            authToken
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
        user.isActive = true;
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
                message: 'Email déjà vérifié'
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
        const { sub: googleId, email, email_verified, name ,picture} = payload;

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
                    role: 'membre',
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


exports.login = async (req, res, next) => {
    try {
        const { email, password, keepmeloggedin } = req.body;

        let user = await User.findOne({ email: email.toLowerCase() });
        console.log("email :",email);
                console.log("password :",password)
        // console.log("email :",email)


       console.log("user ",user)
        // Vérifier si l'utilisateur existe
        if (!user) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }
       console.log("user Activer ",user.isActive)

        // Vérifier si le compte est actif
        if (!user.isActive) {
            return res.status(403).json({ message: "Compte inactif. Veuillez contacter l'administrateur." });
        }


        // Check if user has a password (OAuth users won't have one)
        const isOAuthUser = user.googleId;
        console.log("authGoogle ",isOAuthUser)

        // If user is an OAuth user, they should use OAuth to login
        if (isOAuthUser) {
            return res.status(401).json({
                success: false,
                message: `Ce compte utilise l'authentification Google. Veuillez vous connecter avec Google.`,
                authProvider: 'google'
            });
        }

        console.log("password ",password)
                console.log("user.password ",user.password)

        // For regular users, verify password
        if (!user.password || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ success: false, message: 'Login ou mot de passe incorrect' });
        }


        // Set token expiration based on 'keepmeloggedin'
        const tokenExpiry = keepmeloggedin ? '7d' : '2d';
        const authToken = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: tokenExpiry });

        // Generate a refresh token
        const refreshToken = crypto.randomBytes(64).toString('hex');

        user.refreshToken = refreshToken;

        await user.save();

        res.json({
            success: true,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
                googleId:user.googleId,
                role:user.role,

            authToken, refreshToken
        });

    } catch (error) {
        next(error); // Pass the error to the middleware
    }
};




// Step 1 - Request a password reset
exports.requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;

        const normalizedEmail = email.toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({
                error: 'Utilisateur introuvable'
            });
        }

        if (!user.isActive) {
            return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
        }


        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration

        await user.save();

        // Send reset password email
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        await sendResetPasswordEmail(user.email, resetLink);

        return res.json({
            success: true,
            message: 'Reset password email sent.'
        });

    }
    catch (error) {
        next(error); // Pass the error to the middleware
    }
};

// Step 2 - Reset the password
exports.resetPassword = async (req, res, next) => {
    try {
        const { password, token } = req.body;

        // Find user with the reset token and check expiration
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user.isActive) {
            return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
        }
        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired token.'
            });
        }

        // Hash the new password and save it
        user.password = await bcrypt.hash(password, 10);

        // Clear the reset token and expiration
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        return res.json({
            success: true,
            message: 'Le mot de passe a été réinitialisé avec succès.'
        });

    }
    catch (error) {
        next(error); // Pass the error to the middleware
    }
};

// Function to send reset password email
const sendResetPasswordEmail = (email, resetLink) => {
    // Shared header & footer
    const header = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;
                padding:20px;text-align:center;background:#f5f5f5;">
      <img src="${process.env.LOGO_URL}"
                     alt="Vie Étudiante ISET"
           style="max-height:60px;">
    </div>
  `;
    const footer = `
    <footer style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;
                   padding:20px;text-align:center;color:#666;font-size:12px;">
      <p>© ${new Date().getFullYear()} Vie Étudiante ISET. 
         <a href="${process.env.FRONTEND_URL}/login">Se connecter</a>
      </p>
    </footer>
  `;

    // Email body
    const body = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;
                padding:20px;">
      <h1>Réinitialisation de votre mot de passe</h1>
      <p>Bonjour,</p>
      <p>
        Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour procéder :
      </p>
      <div style="text-align:center;margin:20px 0;">
        <a href="${resetLink}"
           style="display:inline-block;padding:10px 20px;
                  background:#6935EB;color:#fff;text-decoration:none;
                  border-radius:5px;">
          Réinitialiser mon mot de passe
        </a>
      </div>
      <p>
        Ce lien expirera dans 1 heure. Si vous n'avez pas fait cette demande, vous pouvez ignorer ce message.
      </p>
    </div>
  `;

    // Fire-and-forget sendEmail (errors logged, won't throw)
    sendEmail({
        to: email,
        subject: 'Vie Étudiante ISET : réinitialisation de votre mot de passe',
        html: header + body + footer
    }).catch(err => {
        console.error('Échec de l\'envoi de l\'email de réinitialisation :', err);
    });
};


exports.updateUserProfile = async (req, res, next) => {
    try {
        const userId = req.user._id; // récupéré depuis le middleware d'auth JWT
        const updates = { ...req.body }; // tous les champs envoyés

        // Chercher l'utilisateur
        const user = await User.findById(userId);
        if (!user || !user.isActive) {
            return res.status(404).json({ success:false,message: 'Utilisateur introuvable ou inactif' });
        }

        // Gestion du mot de passe séparément
        if (updates.password && updates.password.trim() !== '') {
            console.log("eee ",updates.password)
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        // Mettre à jour les autres champs dynamiquement
        for (let key in updates) {
            if (updates[key] !== undefined && key !== '_id') {
                user[key] = updates[key];
            }
        }

        await user.save();

        res.status(200).json({
            success:true,
            message: 'Profil mis à jour avec succès',
            user: {
                id: userId,
                lastName: user.lastName,
                firstName: user.firstName,
                email: user.email,
                role: user.role,
                googleId:user?.googleId
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur serveur, veuillez réessayer.' });
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
