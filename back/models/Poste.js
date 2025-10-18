const mongoose = require('mongoose');
const Counter = require('./Counter'); // modèle compteur

const posteSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String },
  dateCreation: { type: Date, default: Date.now },
  nbReactions: {
    jaime: { type: Number, default: 0 },
    jadore: { type: Number, default: 0 },
    jaimePas: { type: Number, default: 0 }
  },
  etat: {
    type: String,
    enum: ['partagé', 'cloturé', null],
    default: null // permet null initialement
  },
  lienImage: { type: String, default: null },
  lienVideo: { type: String, default: null }
});

const Poste = mongoose.model('Poste', posteSchema);

module.exports = Poste;
