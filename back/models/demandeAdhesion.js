const mongoose = require('mongoose');
const demandeAdhesionSchema = new mongoose.Schema({
    etudiant: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
         required: true },
    club: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'Club', 
        required: true },
    statut: { type: String, enum: ['en attente','en cours','acceptée', 'refusée'], default: 'en attente' },
    dateDemande: { type: Date, default: Date.now },
    datesProposees: [{ type: Date }],   
    dateChoisie: { type: Date }  
},{timestamps:true});

module.exports = mongoose.model('DemandeAdhesion', demandeAdhesionSchema);