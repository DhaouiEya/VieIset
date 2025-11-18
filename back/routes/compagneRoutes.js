// routes/compagneRoutes.js
const express = require('express');
const router = express.Router();
const compagneController = require('../controllers/compagneController');

// ➕ Créer une nouvelle campagne (administrateur)
router.post('/', compagneController.createCompagne);

// 📋 Récupérer toutes les campagnes
router.get('/', compagneController.getAllCompagnes);

// 🔍 Récupérer une campagne par ID
router.get('/:id', compagneController.getCompagneById);

// ✏️ Mettre à jour une campagne
router.put('/:id', compagneController.updateCompagne);

// 🗑 Supprimer une campagne
router.delete('/:id', compagneController.deleteCompagne);

module.exports = router;
