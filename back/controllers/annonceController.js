const annonceService = require('../services/annonceService');

const createAnnonce = async (req, res) => {
  try {
    const annonce = await annonceService.createAnnonce(req.body);
    res.status(201).json(annonce);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const listAnnonces = async (req, res) => {
  try {
    const annonces = await annonceService.getAnnonces();
    res.status(200).json(annonces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnnonce = async (req, res) => {
  try {
    const annonce = await annonceService.getAnnonceById(req.params.id);
    if (!annonce) return res.status(404).json({ message: 'Annonce non trouvée' });
    res.status(200).json(annonce);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAnnonce,
  listAnnonces,
  getAnnonce,
};
