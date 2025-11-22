// models/DemandeDon.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const demandeDonSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  montant: {
    type: Number,
    required: true,
    min: [0, 'Le montant ne peut pas être négatif']
  },
  dateDemande: {
    type: Date,
    default: Date.now
  },
  statut: {
    type: String,
    enum: ['EN_ATTENTE', 'ACCEPTEE', 'REFUSEE'],
    default: 'EN_ATTENTE'
  },
  // Référence vers l'utilisateur qui a créé la demande
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',           // Le modèle s'appelle 'User'
    required: true
  },
  annexe: {
  type: String, // Chemin du fichier sur le serveur
  required: false
},

}, {
  timestamps: true,
});

module.exports = mongoose.model('DemandeDon', demandeDonSchema);