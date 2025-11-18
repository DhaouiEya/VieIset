const posteService = require('../services/posteService');
const Poste = require('../models/Poste');
const mongoose = require('mongoose');

// création d'un poste
const createPoste = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Utilisateur connecté:', req.user);

    if (!req.user || !req.user._id) {
      return res.status(400).json({ message: 'Utilisateur non trouvé dans la requête.' });
    }

    const clubManagerId = new mongoose.Types.ObjectId(req.user._id);
   // Extraire les fichiers uploadés
    const imageFile = req.files?.image ? req.files.image[0] : null;
    const videoFile = req.files?.video ? req.files.video[0] : null;

    // Construire les chemins relatifs pour les fichiers
    const lienImage = imageFile ? `/uploads/${imageFile.filename}` : null;
    const lienVideo = videoFile ? `/uploads/${videoFile.filename}` : null;

    const posteData = {
      titre: req.body.titre,
      description: req.body.description,
      lienImage,
      lienVideo,
      clubManager: clubManagerId
    };

    console.log('Poste data to save:', posteData);

    const newPoste = new Poste(posteData);
    const savedPoste = await newPoste.save();

    res.status(201).json(savedPoste);
  } catch (error) {
    console.error('Error in createPoste:', error);
    res.status(500).json({ message: 'Erreur serveur', error });
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


const reactToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reaction } = req.body; // 'jaime', 'jaimePas' ou null
    const userId = req.user._id;

    const post = await Poste.findById(postId);
    
    if (!post) return res.status(404).json({ message: "Post non trouvé" });

    // Chercher la réaction précédente de cet utilisateur
    const existing = post.reactions.find(r => r.userId.toString() === userId.toString());

    if (existing) {
      if (reaction === existing.type || reaction === null) {
        // Annuler la réaction précédente
        post.reactions = post.reactions.filter(r => r.userId.toString() !== userId.toString());
      } else {
        // Changer de réaction (ex: "J’aime" -> "J’aime pas")
        existing.type = reaction;
      }
    } else if (reaction) {
      // Nouvelle réaction
      post.reactions.push({ userId, type: reaction });
    }

    // Recalculer les compteurs
    post.nbReactions.jaime = post.reactions.filter(r => r.type === 'jaime').length;
    post.nbReactions.jaimePas = post.reactions.filter(r => r.type === 'jaimePas').length;

    await post.save();

    res.json({ message: "Réaction mise à jour", data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
// SUPPRIMER
const removePoste = async (req, res) => {
  try {
    const { id } = req.params;
    const poste = await Poste.findByIdAndDelete(id);
    if (!poste) return res.status(404).json({ message: 'Poste non trouvé' });
    res.json({ message: 'Poste supprimé', poste });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MODIFIER
const editPoste = async (req, res) => {
  try {
    const { id } = req.params;
    const { titre, description } = req.body;

    const updateData = { titre, description };

    if (req.files?.image) {
      updateData.lienImage = `${req.protocol}://${req.get('host')}/uploads/${req.files.image[0].filename}`;
    }
    if (req.files?.video) {
      updateData.lienVideo = `${req.protocol}://${req.get('host')}/uploads/${req.files.video[0].filename}`;
    }

    const poste = await Poste.findByIdAndUpdate(id, updateData, { new: true });
    if (!poste) return res.status(404).json({ message: 'Poste non trouvé' });

    res.json(poste);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPoste,
  getAllPostes,
  updatePosteEtat,
  reactToPost,
  removePoste,
  editPoste // ✅ ajouter ici

};
