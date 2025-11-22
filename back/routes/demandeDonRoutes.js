// routes/demandeDon.js
const express = require('express');
const router = express.Router();
const demandeDonController = require('../controllers/demandeDonController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authMiddleware = require('../middlewares/authMiddlewares');

// ------------------ MULTER CONFIG DIRECTEMENT ICI ------------------
const uploadDir = 'uploads/annexes';

// Crée le dossier s'il n'existe pas
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = 'annexe-' + Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 Mo max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|pdf/;
    const ext = path.extname(file.originalname).toLowerCase();
    const mime = file.mimetype;
    if (allowed.test(ext) && allowed.test(mime)) {
      cb(null, true);
    } else {
      cb(new Error('Fichier non autorisé (jpg, png, pdf uniquement)'));
    }
  }
});
// --------------------------------------------------------------------

// Route POST avec upload du fichier "annexe"
router.post('/', authMiddleware,upload.single('annexe'), demandeDonController.createDemande);

// Autres routes (sans auth pour tester)
router.get('/all',authMiddleware, demandeDonController.getAllDemandes);
router.get('/me', authMiddleware,demandeDonController.getMyDemandes); // temporairement sans auth

module.exports = router;