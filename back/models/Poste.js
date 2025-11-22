const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const posteSchema = new Schema({
  titre: { type: String, required: true },
  description: { type: String },
  dateCreation: { type: Date, default: Date.now },
  nbReactions: {
    jaime: { type: Number, default: 0 },
    jaimePas: { type: Number, default: 0 }
  },
  reactions: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      type: { type: String, enum: ['jaime', 'jaimePas'] }
    }
  ],
  comments: [
    {
      userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now }
    }
  ],
  etat: { type: String, enum: ['partagé', 'cloturé', null], default: null },
  lienImage: { type: String, default: null },
  lienVideo: { type: String, default: null },
  clubManager: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    validate: {
      validator: async function(value) {
        const etudiant = mongoose.model('User');
        const etu = await etudiant.findById(value);
        return etu && etu.role.includes('clubManager');
      },
      message: 'Le poste doit appartenir à un étudiant ayant le rôle clubManager.'
    }
  }
});

const Poste = mongoose.model('Poste', posteSchema);
module.exports = Poste;
