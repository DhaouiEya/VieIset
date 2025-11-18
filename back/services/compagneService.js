// services/compagneService.js
const Compagne = require('../models/compagne');
// Vérifie si l'objectif est atteint et met à jour le statut
const updateStatusIfCompleted = async (compagne) => {
  if (compagne.montant_collecte >= compagne.objectif_montant) {
    compagne.status = 'terminée'; // ou 'completed'
    await compagne.save();
  }
};

exports.createCompagne = async (data) => {
  try {
    const compagne = new Compagne(data);
    
    // Initialiser le statut à "en cours" si pas défini
    if (!compagne.status) compagne.status = 'en cours';
    
    const savedCompagne = await compagne.save();

    // Vérifier si l'objectif est atteint
    await updateStatusIfCompleted(savedCompagne);

    return savedCompagne;
  } catch (error) {
    throw new Error('Erreur lors de la création de la campagne : ' + error.message);
  }
};


exports.getAllCompagnes = async () => {
  try {
    return await Compagne.find().populate('beneficiaire', 'nom prenom email');
  } catch (error) {
    throw new Error('Erreur lors de la récupération des campagnes : ' + error.message);
  }
};

exports.getCompagneById = async (id) => {
  try {
    return await Compagne.findById(id).populate('beneficiaire', 'nom prenom email');
  } catch (error) {
    throw new Error('Erreur lors de la récupération de la campagne : ' + error.message);
  }
};

exports.updateCompagne = async (id, data) => {
  try {
    const updatedCompagne = await Compagne.findByIdAndUpdate(id, data, { new: true });

    // Vérifier si l'objectif est atteint après mise à jour
    await updateStatusIfCompleted(updatedCompagne);

    return updatedCompagne;
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour de la campagne : ' + error.message);
  }
};


exports.deleteCompagne = async (id) => {
  try {
    return await Compagne.findByIdAndDelete(id);
  } catch (error) {
    throw new Error('Erreur lors de la suppression de la campagne : ' + error.message);
  }

};
