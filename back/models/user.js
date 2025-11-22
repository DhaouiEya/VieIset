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
 adresse: { type: String },
  ville: { type: String },

    photoProfil: { type: String },
    dateNaissance: { type: Date },
    numeroTelephone: { type: String },
  /* ==== Parcours académique ==== */

  filiere: { type: String },         // ex : Informatique, Gestion, Génie Civil
  specialite: { type: String },                      // ex : Développement Web, Réseaux, IA
  niveau: { type: String },          // ex : L1, L2, L3, M1, M2
  classe: { type: String },                          // ex : 2ème année B, Groupe 3

    isActive: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: true },

    googleId: { type: String },

    authProvider: {  //  - Pour savoir comment l'user s'est inscrit
        type: String,
        enum: ['local', 'google', 'both'],
        default: 'local'
    },

    refreshToken: { type: String },
    lastLogin: { type: Date },
    profileCompletion: { type: Number, default: 0 },
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
