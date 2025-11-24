const express = require('express');
const router = express.Router();
const AnnonceController = require('../controllers/annonceController');
const authMiddleware = require('../middlewares/authMiddlewares');

// Routes
router.get('/my-annonces', authMiddleware, AnnonceController.getAnnoncesByUser);

router.post('/', authMiddleware,AnnonceController.createAnnonce); // Créer une annonce
router.get('/', AnnonceController.listAnnonces); // Lister toutes les annonces
router.get('/:id', AnnonceController.getAnnonce); // Récupérer une annonce par ID

module.exports = router;
