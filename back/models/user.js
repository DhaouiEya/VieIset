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

  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  adresse: { type: String },
  ville: { type: String },

  photoProfil: { type: String, default: 'blank.png' },
  dateNaissance: { type: Date },
  numeroTelephone: { type: String },

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



// Fonction de calcul
function calculateCompletion(user) {
  // Champs considérés dans la complétion du profil
  const profileFields = [
    "firstName",
    "lastName",
    "adresse",
    "ville",
    "dateNaissance",
    "numeroTelephone",
    "filiere",
    "specialite",
    "niveau",
    "classe",
    "photoProfil"
  ];
  let filled = 0;

  profileFields.forEach(field => {
    if (user[field] && user[field] !== "") filled++;
  });

  return Math.round((filled / profileFields.length) * 100);
}

// Hook pour save() (création et update manuel)
userSchema.pre("save", function (next) {
  this.profileCompletion = calculateCompletion(this);
  next();
});



// Nom du modèle : User
// Nom de la collection MongoDB : user
module.exports = mongoose.model('User', userSchema, 'user');
