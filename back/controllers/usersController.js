const Etudiant = require('../models/etudiant');

// ✅ Récupérer tous les étudiants
exports.getAllEtudiants = async (req, res) => {
  try {
    const etudiants = await Etudiant.find();
    res.status(200).json(etudiants);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
