const annonceService = require('../services/annonceService');

const createAnnonce = async (req, res) => {
  try {
    const { titre, description } = req.body;
    const createdBy = req.user._id; 

    const annonce = await annonceService.createAnnonce({ titre, description, createdBy });
    res.status(201).json(annonce);
  } catch (err) {
    res.status(500).json({ message: err.message });
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


// Récupérer les annonces d'un utilisateur
const getAnnoncesByUser = async (req, res) => {
  try {
    console.log("aaaaaaaa")
    const userId = req.user._id; 
    const annonces = await annonceService.getAnnoncesByUserId(userId);
    res.json(annonces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  createAnnonce,
  listAnnonces,
  getAnnonce,
  getAnnoncesByUser
};
