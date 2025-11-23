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
    const imageFile = req.files?.image ? req.files.image[0] : null;
    const videoFile = req.files?.video ? req.files.video[0] : null;

    const lienImage = imageFile ? `/uploads/${imageFile.filename}` : null;
    const lienVideo = videoFile ? `/uploads/${videoFile.filename}` : null;

    const posteData = {
      titre: req.body.titre,
      description: req.body.description,
      lienImage,
      lienVideo,
      clubManager: clubManagerId
    };

    const newPoste = new Poste(posteData);
    const savedPoste = await newPoste.save();

    res.status(201).json(savedPoste);
  } catch (error) {
    console.error('Error in createPoste:', error);
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};

// Contrôleur pour récupérer tous les postes avec populate
const getAllPostes = async (req, res) => {
  try {
    const postes = await Poste.find()
      .populate("comments.userId", "firstName lastName")
      .populate("clubManager", "firstName lastName email");

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

    const poste = await Poste.findByIdAndUpdate(id, { etat }, { new: true });
    if (!poste) return res.status(404).json({ message: "Poste non trouvé" });

    res.json(poste);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Réactions à un poste
const reactToPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { reaction } = req.body;
    const userId = req.user._id;

    const post = await Poste.findById(postId);
    if (!post) return res.status(404).json({ message: "Post non trouvé" });

    const existing = post.reactions.find(r => r.userId.toString() === userId.toString());

    if (existing) {
      if (reaction === existing.type || reaction === null) {
        post.reactions = post.reactions.filter(r => r.userId.toString() !== userId.toString());
      } else {
        existing.type = reaction;
      }
    } else if (reaction) {
      post.reactions.push({ userId, type: reaction });
    }

    post.nbReactions.jaime = post.reactions.filter(r => r.type === 'jaime').length;
    post.nbReactions.jaimePas = post.reactions.filter(r => r.type === 'jaimePas').length;

    await post.save();

    res.json({ message: "Réaction mise à jour", data: post });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Supprimer un poste
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

// Modifier un poste
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

// Ajouter un commentaire
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text) return res.status(400).json({ message: "Le commentaire ne peut pas être vide." });

    const post = await Poste.findById(postId);
    if (!post) return res.status(404).json({ message: "Post non trouvé." });

    post.comments.push({ userId, text });
    await post.save();

    // Populer les commentaires pour renvoyer le nom de l'utilisateur
    const populatedPost = await Poste.findById(postId)
      .populate("comments.userId", "firstName lastName photoProfil")
      .populate("clubManager", "firstName lastName photoProfil");

    res.status(201).json({ message: "Commentaire ajouté.", comments: populatedPost.comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};

module.exports = {
  createPoste,
  getAllPostes,
  updatePosteEtat,
  reactToPost,
  removePoste,
  editPoste,
  addComment
};
