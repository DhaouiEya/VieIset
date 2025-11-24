const express = require('express');
const router = express.Router();
const reclamationController = require('../controllers/reclamationController');
//const authMiddleware = require('../middlewares/authMiddlewares');

router.post('/create', reclamationController.createReclamation);
router.get('/', reclamationController.getAllReclamations);
router.get('/etudiant/:etudiantId', reclamationController.getReclamationsByEtudiantId );
router.patch('/reclamation/:reclamationId/status', reclamationController.updateReclamationStatus);
module.exports = router;