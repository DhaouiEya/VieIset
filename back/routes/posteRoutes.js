const express = require('express');
const router = express.Router();
const posteController = require('../controllers/posteController');
const authMiddleware = require('../middlewares/authMiddlewares');
const multer = require('multer');
const path = require('path');

// Configuration de multer pour l'upload des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed!'), false);
    }
  }
});

// ✅ Route POST : création d’un poste avec upload de fichiers
router.post('/', authMiddleware, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), posteController.createPoste);

// Récupérer tous les postes
router.get('/', posteController.getAllPostes);

// Mettre à jour l'état d'un poste
router.put('/:id/etat', posteController.updatePosteEtat);

router.put('/react/:postId', authMiddleware, posteController.reactToPost);
// 5. Supprimer un poste
router.delete('/:id', posteController.removePoste);

// 6. Modifier un poste (titre, description, image, vidéo)
// 6. Modifier un poste (titre, description, image, vidéo)
// Wrapper pour multer
const uploadFiles = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

router.put('/:id', authMiddleware, (req, res, next) => {
  uploadFiles(req, res, function(err) {
    if (err) return next(err);
    posteController.editPoste(req, res, next);
  });
});



module.exports = router;
