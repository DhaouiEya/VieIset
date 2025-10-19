const express = require("express");
const router = express.Router();
const clubController = require("../controllers/clubController");
//post


router.post("/", clubController.createClub);
router.get("/clubManager/:id", clubController.getClubByManager);
// router.get("/", clubController.getAllClubs);

// //securiser la route avec authMiddleware si role clubManager
// router.post("/", async (req, res) => {
//     try {
//         // Assigner automatiquement le manager connecté
//         // const managerId = req.user._id; // req.user défini par authMiddleware
//         // const clubData = {
//         //     ...req.body,
//         //     manager: managerId
//         // };

//         const club = new Club(req.body);
//         await club.save();
//         res.status(201).json(club);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });
// router.get('/clubManager/:id', async (req, res) => {
//   const managerId = req.params.id;
//   try {
//     const club = await Club.findOne({ manager: managerId })
//                            .populate("manager", "firstName lastName email")
//                            .populate("membres");

//     if (!club) return res.status(200).json(null);

//     res.status(200).json(club);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erreur serveur', error: error.message });
//   }
// });





module.exports = router;