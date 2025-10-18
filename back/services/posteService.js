const Poste = require('../models/Poste');

// Service pour créer un poste
const createPoste = async (data) => {
  const { titre, description, lienImage, lienVideo, partager } = data;

  const poste = new Poste({
    titre,
    description,
    lienImage: lienImage || null,
    lienVideo: lienVideo || null,
    etat: partager ? 'partagé' : null, // Changed from 'brouillon' to null as per schema
  });

  return await poste.save();
};

// Service pour récupérer tous les postes
const getAllPostes = async () => {
  return await Poste.find();
};

// Service pour mettre à jour l'état d'un poste
const updatePosteEtat = async (id, etat) => {
  const poste = await Poste.findById(id);
  if (!poste) {
    throw new Error('Poste not found');
  }

  poste.etat = etat;
  return await poste.save();
};

module.exports = {
  createPoste,
  getAllPostes,
  updatePosteEtat,
};
