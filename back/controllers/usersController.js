const User = require('../models/user');
const bcrypt = require('bcryptjs');

// ✅ Récupérer tous les étudiants
exports.getAllEtudiants = async (req, res) => {
  try {
    const etudiants = await User.find({role: 'etudiant'});
    res.status(200).json(etudiants);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};



exports.getByFFilteredEtudiants = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;

    // Filtre pour la recherche
    const searchRegex = new RegExp(search, 'i');
    const filter = {
      role: { $eq: ['etudiant'] }, // Exact match - seulement ['etudiant']
      $or: [
        { nom: searchRegex },
        { prenom: searchRegex },
        { email: searchRegex }
      ]
    };

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Total des résultats
    const total = await User.countDocuments(filter);
    const pages = Math.ceil(total / limitNumber);

    // Récupérer les étudiants
    const etudiants = await User.find(filter)
      .skip(skip)
      .limit(limitNumber);

    res.status(200).json({
      etudiants,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        pages
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};



exports.addClubManagerRole = async (req, res) => {
  const { userId } = req.params;
  const { password } = req.body; // mot de passe fourni depuis le frontend si nécessaire

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });

    // Vérifier que l'utilisateur est bien un étudiant
    if (!user.role.includes('etudiant')) {
      return res.status(403).json({
        success: false,
        message: "Seuls les utilisateurs avec le rôle 'etudiant' peuvent devenir Club Manager"
      });
    }

    // Si l'utilisateur n'a pas de mot de passe (Google-only), vérifier que le frontend en a fourni un
    if (!user.password && user.googleId) {
      if (!password) {
        return res.status(400).json({
          success: false,
          message: "Mot de passe requis pour lier le rôle Club Manager à cet étudiant Google"
        });
      }
      // Hasher le mot de passe avant de le sauvegarder
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;

      // Mettre à jour authProvider
      user.authProvider = 'both';
    }

    // Ajouter clubManager si pas déjà présent
    if (!user.role.includes('clubManager')) {
      user.role.push('clubManager');
    }

    await user.save();

    res.json({
      success: true,
      message: 'Rôle clubManager ajouté avec succès',
        user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        authProvider: user.authProvider
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

