// routes/sheetRoutes.js
const express = require("express");
const router = express.Router();
const { lireSheet } = require("../services/googleSheetService"); // Importez directement le service

// Route pour récupérer les données Google Sheets
router.post('/get-data', async (req, res) => {
  try {
    const { spreadsheetId } = req.body;
    
    console.log('Tentative de chargement du spreadsheet:', spreadsheetId);
    
    if (!spreadsheetId) {
      return res.status(400).json({ error: 'SPREADSHEET_ID requis' });
    }

    const etudiants = await lireSheet(spreadsheetId);
    res.json(etudiants);

  } catch (error) {
    console.error('Erreur serveur:', error.message);
    
    if (error.message.includes('Colonne Email introuvable')) {
      return res.status(400).json({ 
        error: error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Erreur lors de la récupération des données',
      details: error.message 
    });
  }
});

module.exports = router;