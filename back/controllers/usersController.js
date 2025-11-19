const User = require('../models/user');

// ✅ Récupérer tous les étudiants
exports.getAllEtudiants = async (req, res) => {
  try {
    const etudiants = await User.find({role: 'etudiant'});
    res.status(200).json(etudiants);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};
