const mongoose = require('mongoose');

const participationSchema = new mongoose.Schema({
    etudiant: { type: mongoose.Schema.Types.ObjectId, ref: 'Etudiant', required: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    dateParticipation: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Participation', participationSchema);
