const express = require("express");
const router = express.Router();
const clubController = require("../controllers/clubController");
const authMiddleware = require('../middlewares/authMiddlewares');

//post


// consulter les infos du club (par le responsable)
router.get('/mon-club', authMiddleware, clubController.consulterClub);

//le responsble de club peut créer un club
router.post("/", clubController.createClub);

router.get("/clubManager/:id", clubController.getClubByManager);

//afficher tous les clubs pour les étudiants
router.get("/", clubController.getAllClubs);


// GET club + posts
router.get('/:id', authMiddleware,clubController.getClubById);

// modifier les infos du club
router.put('/mon-club', authMiddleware, clubController.modifierClub);

// désactiver le club
router.put('/mon-club/desactiver', authMiddleware,clubController.desactiverClub);

//activer club
router.put('/mon-club/activer', authMiddleware,clubController.activerClub)

module.exports = router;