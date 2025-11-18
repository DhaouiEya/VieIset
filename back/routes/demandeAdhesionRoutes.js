const express = require('express');
const router = express.Router();
const demandeAdhesionController = require('../controllers/demandeAdhesionController');
const authMiddleware = require('../middlewares/authMiddlewares');

router.post('/', demandeAdhesionController.createDemande);
router.post('/demandes/:id/envoyer-dates',demandeAdhesionController.envoyerDates);
router.get('/demandes',demandeAdhesionController.getDemandesAdhesion);
//get date choisi par l'etudiant 
router.get('/demandes/:id/choisir-date' , demandeAdhesionController.getDatesChoisies);
router.get('/demandes', authMiddleware,demandeAdhesionController.getDemandesByEtudiant);
module.exports = router;