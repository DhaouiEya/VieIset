const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const etudiantSchema = new Schema({
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String }, // Store email verification token
    emailVerificationExpires: { type: Date }, // Expiration time for email verification

    password: { type: String },
    // Password reset
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    cin: { type: String, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, enum: ['Homme', 'Femme'] },
    age: { type: Number },
    phone: { type: String, unique: true },
    city: { type: String },
    postalCode: { type: String },
    address: { type: String },


    department: { type: String, enum: ['Technology', 'Management'] },
    niveau: { type: String, enum: ['L1', 'L2', 'L3', 'M1', 'M2'] },
    speciality: { type: String, enum: ['DSI', 'RSI', 'IOT', 'MAF', 'LET', 'MIN', 'QHSE', 'CO-CMI'] },
    classe: { type: String },
   

    hobbies: [{ type: String }],      // Loisirs : sport, musique, art...
    skills: [{ type: String }],      // Compétences : programmation, gestion de projet...
    motivation: { type: String },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    preferences: [{ type: String }],

    languages: [{ type: String, enum: ['Français', 'Anglais', 'Espagnol', 'Allemand', 'Italien', 'Chinois', 'Arabe', 'Russe', 'Japonais', 'Turc', 'Coréen', 'Autre'] }],

    volunteering: [{                // Expériences associatives ou bénévolat
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

  


    //Réseaux et contacts
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },

    //health
    allergies: [{ type: String }],
    accessibilityNeeds: { type: String }, // Handicap ou besoins particuliers

    isActive: { type: Boolean, default: true },
    isOnline: { type: Boolean, default: true },

    // Social login fields
    googleId: { type: String },

    // Security and login details
    refreshToken: { type: String }, // For refresh token in JWT-based auth
    lastLogin: { type: Date }, // Store last login time
    role: { type: String, enum: ['etudiant', 'membre', 'clubManger', 'admin'], default: 'etudiant' },
    

 preRegistered: { type: Boolean, default: false }, // Indique si l'utilisateur a rempli les infos pré-inscription
    role: { type: String, enum: ['user', 'admin', 'clubManager'], default: 'user' },


}, { timestamps: true });

module.exports = mongoose.model('Etudiant', etudiantSchema);