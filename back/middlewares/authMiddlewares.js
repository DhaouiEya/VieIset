const jwt = require('jsonwebtoken');
const User = require('../models/user'); 


module.exports = async function (req, res, next) {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({
      error: {
        message: 'Accès refusé : aucun jeton fourni.',
        severity: 'warning',
        code: 'NO_TOKEN'
      }
    });
  }

  const token = authHeader.replace('Bearer ', '');

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Charger l'utilisateur depuis la base de données
    const user = await User.findById(decoded._id)


    if (!user) {
      return res.status(404).json({
        error: {
          message: 'Utilisateur introuvable.',
          code: 'USER_NOT_FOUND'
        }
      });
    }


    // Attacher l'utilisateur complet à la requête
    req.user = user;

    next(); // Continuer vers le contrôleur ou le prochain middleware
  } catch (err) {
    console.error('Erreur JWT :', err.message);
    return res.status(401).json({
      error: {
        message: "Votre session a expiré ou le jeton est invalide.",
        severity: "warning",
        code: "INVALID_TOKEN"
      }
    });
  }
};
