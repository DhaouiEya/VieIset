const express = require("express");
const router = express.Router();
const multer = require('multer');
const clubController = require("../controllers/clubController");
const authMiddleware = require('../middlewares/authMiddlewares');

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


router.post( '/create', upload.fields([ { name: 'imageProfil', maxCount: 1 }, 
    { name: 'imageFond', maxCount: 1 } ]), clubController.createClub );
router.get("/clubManager/:id", clubController.getClubByManager);
router.get("/", clubController.getAllClubs);
router.get('/:id', authMiddleware,clubController.getClubById);





module.exports = router;