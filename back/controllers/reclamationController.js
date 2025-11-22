const Etudiant = require('../models/etudiant');
const Reclamation = require('../models/reclamation');


const createReclamation = async (req, res) => {
  try {
    const { etudiantId, sujet, description } = req.body;
    const etudiant = await Etudiant.findById(etudiantId);
    if (!etudiant) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }
    const reclamation = new Reclamation({
      etudiant: etudiant._id,
      sujet,
      description
    });

    await reclamation.save();
    res.status(201).json(reclamation);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

const getAllReclamations = async (req, res) => {
  try {
    const reclamations = await Reclamation.find().populate('etudiant', 'lastName firstName email');
    res.status(200).json(reclamations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
// Nouvelle fonction : récupérer les réclamations par ID d'étudiant
const getReclamationsByEtudiantId = async (req, res) => {
  try {
    const { etudiantId } = req.params;
    const etudiant = await Etudiant.findById(etudiantId);
    if (!etudiant) {
      return res.status(404).json({ message: 'Étudiant non trouvé' });
    }

    const reclamations = await Reclamation.find({ etudiant: etudiantId })
     
    res.status(200).json(reclamations);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
// Mettre à jour le statut d'une réclamation
const updateReclamationStatus = async (req, res) => {
  try {
    const { reclamationId } = req.params;
    const { statut } = req.body; // le nouveau statut à mettre à jour

    // Vérifier que la réclamation existe
    const reclamation = await Reclamation.findById(reclamationId);
    if (!reclamation) {
      return res.status(404).json({ message: 'Réclamation non trouvée' });
    }

    // Mettre à jour le statut
    reclamation.statut = statut; // exemple : "En cours", "Résolue", "Refusée"

    await reclamation.save();

    res.status(200).json({
      success: true,
      message: 'Statut de la réclamation mis à jour',
      reclamation
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};


module.exports = {
    createReclamation,getAllReclamations,getReclamationsByEtudiantId,updateReclamationStatus
};