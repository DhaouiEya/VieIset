const express = require("express");
const router = express.Router();
const dashboardService = require("../services/adminStat");

router.get("/stats", async (req, res) => {
  try {
    const stats = await dashboardService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error("Erreur stats dashboard:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
