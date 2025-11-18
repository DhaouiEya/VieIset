const mongoose = require('mongoose');
const Counter = require('./Counter'); // modèle compteur
const Schema = mongoose.Schema; 

const posteSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  
  description: { type: String },
  dateCreation: { type: Date, default: Date.now },
  nbReactions: {
    jaime: { type: Number, default: 0 },
    jaimePas: { type: Number, default: 0 }
  },
   reactions: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'Etudiant' },
      type: { type: String, enum: ['jaime', 'jaimePas'] }
    }
  ],
  etat: {
    type: String,
    enum: ['partagé', 'cloturé', null],
    default: null // permet null initialement
  },
  lienImage: { type: String, default: null },
  lienVideo: { type: String, default: null },

   // Ajout de la référence au clubManager
  clubManager: {
    type: Schema.Types.ObjectId,
    ref: 'Etudiant',
    required: true,
    validate: {
      validator: async function(value) {
        const etudiant = mongoose.model('Etudiant');
        const etu = await etudiant.findById(value);
        return etu && etu.role === 'clubManager';
      },
      message: 'Le poste doit appartenir à un étudiant ayant le rôle clubManager.'
    }
  }
});

const Poste = mongoose.model('Poste', posteSchema);

module.exports = Poste;
