const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const etudiantSchema = new Schema({
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },

    password: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    cin: { type: String, unique: true, sparse:true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: ['Homme', 'Femme'] },
    age: { type: Number },
    phone: { type: String, unique: true, sparse:true },
    city: { type: String },
    postalCode: { type: String },
    address: { type: String },

    department: { type: String, enum: ['Technology', 'Management'] },
    niveau: { type: String, enum: ['L1', 'L2', 'L3', 'M1', 'M2'] },
    speciality: { type: String, enum: ['DSI', 'RSI', 'IOT', 'MAF', 'LET', 'MIN', 'QHSE', 'CO-CMI'] },
    classe: { type: String },

    hobbies: [{ type: String }],
    skills: [{ type: String }],

    volunteering: [{
        organization: { type: String },
        role: { type: String },
        description: { type: String },
        startDate: { type: Date },
        endDate: { type: Date }
    }],

    certifications: [{
        title: { type: String, required: true },
        institution: { type: String },
        description: { type: String },
        issueDate: { type: Date },
        expiryDate: { type: Date },
        documentURL: { type: String }
    }],

    linkedin: { type: String },
    github: { type: String },

    allergies: [{ type: String }],
    accessibilityNeeds: { type: String },

    isActive: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: true },

    googleId: { type: String },
    refreshToken: { type: String },
    lastLogin: { type: Date },

    preRegistered: { type: Boolean, default: false },
    role: { type: String, enum: ['membre', 'clubManager'], default: 'membre' }
}, { timestamps: true });

module.exports = mongoose.model('Etudiant', etudiantSchema);
