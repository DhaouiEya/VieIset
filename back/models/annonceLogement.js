const mongoose = require('mongoose');
const User=require('./user')
const annonceLogementSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  dateCreation: {
    type: Date,
    default: Date.now
  },
    createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',           // Le modèle s'appelle 'User'
    required: true
  },
});

// ✅ Création du modèle à partir du schéma
const AnnonceLogement = mongoose.model('AnnonceLogement', annonceLogementSchema);

// ✅ Export du modèle (et non du schéma)
module.exports = AnnonceLogement;
