const express = require('express');
const router = express.Router();
const etudiantController = require('../controllers/usersController');

// ✅ Récupérer tous les étudiants
router.get('/', etudiantController.getAllEtudiants);

module.exports = router;
