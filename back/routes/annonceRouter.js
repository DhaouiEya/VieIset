const express = require('express');
const router = express.Router();
const AnnonceController = require('../controllers/annonceController');
const authMiddleware = require('../middlewares/authMiddlewares');

// Routes
router.post('/', AnnonceController.createAnnonce); // Créer une annonce
router.get('/', AnnonceController.listAnnonces); // Lister toutes les annonces
router.get('/:id', AnnonceController.getAnnonce); // Récupérer une annonce par ID

module.exports = router;
