const express = require("express");
const router = express.Router();
const clubController = require("../controllers/clubController");
const authMiddleware = require('../middlewares/authMiddlewares');
const multer = require('multer');

// Dossier de stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // assure-toi que le dossier existe
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Création de l'upload
const upload = multer({ storage });

//post


// consulter les infos du club (par le responsable)
router.get('/mon-club', authMiddleware, clubController.consulterClub);

//le responsble de club peut créer un club
router.post( '/create', upload.fields([ { name: 'imageProfil', maxCount: 1 }, 
    { name: 'imageFond', maxCount: 1 } ]), clubController.createClub );

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