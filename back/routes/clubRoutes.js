const express = require("express");
const router = express.Router();
const clubController = require("../controllers/clubController");
//post


router.post("/", clubController.createClub);
router.get("/clubManager/:id", clubController.getClubByManager);
// router.get("/", clubController.getAllClubs);






module.exports = router;