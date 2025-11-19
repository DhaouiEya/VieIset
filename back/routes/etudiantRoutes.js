const express = require('express');
const router = express.Router();
const etudiantController = require('../controllers/usersController');

router.get('/', etudiantController.getAllEtudiants);

module.exports = router;
