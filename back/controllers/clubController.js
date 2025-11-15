const Club = require("../models/club");
 const Poste = require("../models/Poste"); 
const clubService = require('../services/clubService'); 
// Récupérer un club par l'ID du manager

exports.createClub = async (req, res) => { 
  try { 
   const imageProfil = req.files?.imageProfil?.[0];
   const imageFond = req.files?.imageFond?.[0];

    const clubData = { 
      nom: req.body.nom,
       description: req.body.description, 
       imageProfil: imageProfil?.filename || null,
      imageFond: imageFond?.filename || null,

       dateCreation: req.body.dateCreation,
        departement: req.body.departement, 
        adresse: req.body.adresse,
         telephone: req.body.telephone,
          email: req.body.email, 
          facebook: req.body.facebook,
           instagram: req.body.instagram,
            manager: req.body.manager, };
             const club = await clubService.createClub(clubData);
              res.status(201).json(club); } 
              catch (err) {
                 console.error(err); res.status(500).json({ message: err.message }); 
                } };
exports.getClubByManager = async (req, res) => {
  const managerId = req.params.id;
  try {
    const club = await Club.findOne({ manager: managerId })
      .populate("manager", "firstName lastName email")
      .populate("membres");

    if (!club) return res.status(200).json(null);

    res.status(200).json(club);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find({ actif: true });
    res.status(200).json(
      { success: true, data: clubs }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des clubs actifs' });
  }
}



// Récupérer un club par son ID et ses posts
exports.getClubById = async (req, res) => {
  try {
    const clubId = req.params.id;

    // Récupérer le club avec info manager et membres
    const club = await Club.findById(clubId)
      .populate('manager', 'firstName lastName email') // info du manager

    if (!club) {
      return res.status(404).json({ message: 'Club non trouvé' });
    }

    // Récupérer les posts liés au manager du club (ou tu peux créer un champ clubId si tu veux)
    // Exemple pour inclure la réaction actuelle de l'utilisateur
    const posts = await Poste.find({ clubManager: club.manager._id }).sort({ dateCreation: -1 }).lean();
posts.forEach(post => {
  const reactions = post.reactions || []; // si undefined, on utilise un tableau vide
  const userReaction = reactions.find(r => r.userId.toString() === req.user._id.toString());
  post.userReaction = userReaction ? userReaction.type : null;
});

    // Réponse
    res.json({ data: { club, posts } });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

