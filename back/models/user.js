const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },

    password: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    cin: { type: String, unique: true, sparse: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String },

    isActive: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: true },

    googleId: { type: String },

    refreshToken: { type: String },
    lastLogin: { type: Date },

    preRegistered: { type: Boolean, default: false },
    role: {
        type: [String],
        enum: ['etudiant', 'clubManager', 'admin'],
        default: ['etudiant']
    }

}, { timestamps: true });

// Nom du modèle : User
// Nom de la collection MongoDB : user
module.exports = mongoose.model('User', userSchema, 'user');