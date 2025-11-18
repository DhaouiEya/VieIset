const mongoose = require('mongoose');
const Etudiant = require('./user');

const compagneSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  dateDebut: { type: Date, required: true },
  dateFin: {
    type: Date,
    required: true,
    validate: {
      validator: function(value) {
        // 'this' fait référence au document courant
        return value > this.dateDebut;
      },
      message: 'La date de fin doit être postérieure à la date de début.'
    }
  },
  objectif_montant: { type: Number, required: true, min: 0 },
  montant_collecte: { type: Number, default: 0, min: 0 },
  statut: {
    type: String,
    enum: ['en cours', 'terminée', 'annulée', 'lancée'],
    default: 'lancée'
  },
  beneficiaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Etudiant',
    required: true
  },
  dateCreation: { type: Date, default: Date.now }
});
// ✅ Middleware pour mettre à jour le statut automatiquement
compagneSchema.pre('save', function(next) {
  if (this.montant_collecte >= this.objectif_montant) {
    this.statut = 'terminée';
  }
  next();
});
// Middleware pour findOneAndUpdate (fonctionne pour findByIdAndUpdate)
compagneSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate();

  if (update.montant_collecte !== undefined && update.objectif_montant !== undefined) {
    if (update.montant_collecte >= update.objectif_montant) {
      update.statut = 'terminée';
    }
  }

  next();
});

const Compagne = mongoose.model('Compagne', compagneSchema);

// ✅ ligne correcte
module.exports = Compagne;
