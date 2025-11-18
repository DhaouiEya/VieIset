// controllers/compagneController.js
const compagneService = require('../services/compagneService');

// ➕ Publier une nouvelle campagne
exports.createCompagne = async (req, res) => {
  try {
    const { dateDebut, dateFin } = req.body;

    if (new Date(dateDebut) >= new Date(dateFin)) {
      return res.status(400).json({ message: 'La date de fin doit être postérieure à la date de début.' });
    }

    const compagne = await compagneService.createCompagne(req.body);
    res.status(201).json({ message: 'Campagne créée avec succès', compagne });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Récupérer toutes les campagnes
exports.getAllCompagnes = async (req, res) => {
  try {
    const compagnes = await compagneService.getAllCompagnes();
    res.status(200).json(compagnes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Récupérer une campagne par ID
exports.getCompagneById = async (req, res) => {
  try {
    const compagne = await compagneService.getCompagneById(req.params.id);
    if (!compagne) {
      return res.status(404).json({ message: 'Campagne non trouvée' });
    }
    res.status(200).json(compagne);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Mettre à jour une campagne
exports.updateCompagne = async (req, res) => {
  try {
    const compagne = await compagneService.updateCompagne(req.params.id, req.body);
    if (!compagne) {
      return res.status(404).json({ message: 'Campagne non trouvée' });
    }
    res.status(200).json({ message: 'Campagne mise à jour', compagne });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🗑 Supprimer une campagne
exports.deleteCompagne = async (req, res) => {
  try {
    const compagne = await compagneService.deleteCompagne(req.params.id);
    if (!compagne) {
      return res.status(404).json({ message: 'Campagne non trouvée' });
    }
    res.status(200).json({ message: 'Campagne supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
