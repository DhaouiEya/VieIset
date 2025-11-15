const multer = require('multer');
const path = require('path');

// Configurer le stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // dossier où les fichiers seront enregistrés
  },
  filename: function (req, file, cb) {
    // on ajoute un timestamp pour éviter les collisions
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Filtrer les fichiers si nécessaire (optionnel)
const fileFilter = (req, file, cb) => {
  // exemple : accepter seulement les images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
