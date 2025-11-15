const express = require('express');
const router = express.Router();
const demandeAdhesionController = require('../controllers/demandeAdhesionController');


router.post('/', demandeAdhesionController.createDemande);
router.post('/demandes/:id/envoyer-dates',demandeAdhesionController.envoyerDates);
router.get('/demandes',demandeAdhesionController.getDemandesAdhesion);
//get date choisi par l'etudiant 
router.get('/demandes/:id/choisir-date' , demandeAdhesionController.getDatesChoisies);
router.get('/demandes/:etudiantId',demandeAdhesionController.getDemandesByEtudiant);
module.exports = router;