// controllers/sheetController.js
const { lireSheet } = require("../services/googleSheetService");

exports.getSheetData = async (req, res) => {
  const { spreadsheetId } = req.body; // récupéré depuis Angular
  if (!spreadsheetId) return res.status(400).json({ message: "SPREADSHEET_ID manquant !" });

  try {
    const data = await lireSheet(spreadsheetId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Impossible de lire le Google Sheet", error: err.message });
  }
};
