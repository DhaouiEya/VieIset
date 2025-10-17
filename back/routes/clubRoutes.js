const express = require("express");
const router = express.Router();
const Club = require("../models/club");
//post
router.post("/", async (req, res) => {
    try {
        const club = new Club(req.body);
        await club.save();
        res.status(201).json(club);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// GET /responsable/:id
router.get('/responsable/:id', async (req, res) => {
  const responsableId = req.params.id;
  try {
    const club = await Club.findOne({ responsable: responsableId });

    if (!club) {
      return res.status(200).json(null); 
    }

    res.status(200).json(club);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



module.exports = router;