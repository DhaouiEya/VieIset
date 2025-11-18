const AnnonceLogement = require('../models/annonceLogement');

// Service pour créer une annonce
const createAnnonce = async (data) => {
  const { titre, description } = data;

  const annonce = new AnnonceLogement({
    titre,
    description,
    dateCreation: new Date(), // facultatif, car on a déjà un default dans le modèle
  });

  return await annonce.save();
};

// Service pour récupérer toutes les annonces
const getAnnonces = async () => {
  return await AnnonceLogement.find().sort({ dateCreation: -1 });
};

// Service pour récupérer une annonce par ID
const getAnnonceById = async (id) => {
  return await AnnonceLogement.findById(id);
};

module.exports = {
  createAnnonce,
  getAnnonces,
  getAnnonceById,
};
