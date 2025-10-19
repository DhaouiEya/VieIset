const Club = require("../models/club");


// Ajouter un nouveau club
exports.createClub = async (req, res) => {
  try {
    // Exemple si tu veux lier automatiquement le manager connecté :
    // const managerId = req.user._id;
    // const clubData = { ...req.body, manager: managerId };

    const club = new Club(req.body);
    await club.save();
    res.status(201).json(club);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Récupérer un club par l'ID du manager
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




