const AnnonceLogement = require('../models/annonceLogement');

// Service pour créer une annonce
const createAnnonce = async (data) => {
  const { titre, description,createdBy } = data;

  const annonce = new AnnonceLogement({
    titre,
    description,
    dateCreation: new Date(),
    createdBy, 
  });

  return await annonce.save();
};

// Service pour récupérer toutes les annonces
const getAnnonces = async () => {
  return await AnnonceLogement.find().sort({ dateCreation: -1 }).populate('createdBy');
};

// Service pour récupérer une annonce par ID
const getAnnonceById = async (id) => {
  return await AnnonceLogement.findById(id).populate('createdBy');
};


// Récupérer les annonces d'un utilisateur
const getAnnoncesByUserId = async (userId) => {
  return await AnnonceLogement.find({ createdBy: userId }).sort({ dateCreation: -1 }).populate('createdBy');
};


module.exports = {
  createAnnonce,
  getAnnonces,
  getAnnonceById,
  getAnnoncesByUserId
};
