const express = require('express');
const router = express.Router();
const etudiantController = require('../controllers/usersController');

router.get('/', etudiantController.getAllEtudiants);
router.get('/etudiants', etudiantController.getByFFilteredEtudiants);

// Route pour ajouter le rôle Club Manager à un étudiant
router.patch('/:userId/add-club-manager', etudiantController.addClubManagerRole);
module.exports = router;
