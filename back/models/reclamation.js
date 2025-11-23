const mongoose = require('mongoose');

const ReclamationSchema = new mongoose.Schema({
  etudiant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sujet: { type: String, required: true },
  description: { type: String, required: true },
  statut: { type: String, enum: ['Nouvelle','En cours','Résolue','Rejetée'], default: 'Nouvelle' },
  dateCreation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reclamation', ReclamationSchema);
