const posteService = require('../services/posteService');

// Contrôleur pour créer un poste
const createPoste = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);

    // Extraire les fichiers uploadés
    const imageFile = req.files?.image ? req.files.image[0] : null;
    const videoFile = req.files?.video ? req.files.video[0] : null;

    // Construire les chemins relatifs pour les fichiers
    const lienImage = imageFile ? `/uploads/${imageFile.filename}` : null;
    const lienVideo = videoFile ? `/uploads/${videoFile.filename}` : null;

    // Combiner les données du body avec les liens des fichiers
    const posteData = {
      titre: req.body.titre,
      description: req.body.description,
      partager: req.body.partager === 'true',
      lienImage,
      lienVideo
    };

    console.log('Poste data to save:', posteData);

    const poste = await posteService.createPoste(posteData);
    res.status(201).json(poste);
  } catch (err) {
    console.error('Error in createPoste:', err);
    res.status(400).json({ message: err.message });
  }
};

// Contrôleur pour récupérer tous les postes
const getAllPostes = async (req, res) => {
  try {
    const postes = await posteService.getAllPostes();
    res.json(postes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Contrôleur pour mettre à jour l'état d'un poste
const updatePosteEtat = async (req, res) => {
  try {
    const { id } = req.params;
    const { etat } = req.body;

    const poste = await posteService.updatePosteEtat(id, etat);
    res.json(poste);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createPoste,
  getAllPostes,
  updatePosteEtat,
};
