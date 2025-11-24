const Etudiant = require("../models/user");
const Club = require("../models/club");
const Evenement = require("../models/Event");
const Don = require("../models/compagne");
const Reclamation = require("../models/reclamation");

module.exports.getDashboardStats = async () => {

  // 🔹 Étudiants
  const totalEtudiants = await Etudiant.countDocuments();

  // 🔹 Clubs
  const totalClubs = await Club.countDocuments();

  // 🔹 Événements actifs
  const totalEvenementsActifs = await Evenement.countDocuments();

  // 🔹 Total dons (champ : montant ? total ? somme ?)
  const dons = await Don.aggregate([
    { $group: { _id: null, total: { $sum: "$montant_collecte" } } }  // <-- adapte si ton champ n'est pas "montant"
  ]);

  // 🔹 Réclamations
  const totalReclamations = await Reclamation.countDocuments();

  return {
    totalEtudiants,
    totalClubs,
    totalEvenementsActifs,
    totalDons: dons.length > 0 ? dons[0].total : 0,
    totalReclamations
  };
};
