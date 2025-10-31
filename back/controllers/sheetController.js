const { traiterSheet,lireSheet} = require("../services/googleSheetService");


// exports.getSheetData = async (req, res) => {
//   try {
//     const { spreadsheetId } = req.body;

//     if (!spreadsheetId) {
//       return res.status(400).json({ 
//         success: false,
//         message: "SPREADSHEET_ID manquant !" 
//       });
//     }

//     const data = await traiterSheet(spreadsheetId);

//     // Vérifier si des demandes ont été créées
//     if (!data || data.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message: "Aucune donnée traitée (vérifier les emails et clubs dans MongoDB)",
//         data: []
//       });
//     }

//     // Tout s'est bien passé
//     res.status(200).json({
//       success: true,
//       message: `${data.length} demandes d'adhésion créées`,
//       data
//     });

//   } catch (error) {
//     console.error("Erreur getSheetData:", error);
//     res.status(500).json({
//       success: false,
//       message: "Impossible de lire ou traiter le Google Sheet",
//       error: error.message
//     });
//   }
// };

// Traiter la feuille Google et créer les demandes
exports.processSheet = async (req, res) => {
  try {
    const { spreadsheetId } = req.body;
    if (!spreadsheetId) 
      return res.status(400).json({ error: 'SPREADSHEET_ID requis' });

    // Lire les lignes depuis Google Sheets
    const rows = await lireSheet(spreadsheetId);
    console.log("Rows lues:", rows);

    if (!rows.length) 
      return res.status(200).json({ success: true, message: "Sheet vide", rows });

    // Passer le tableau de rows à traiterSheet
    const demandes = await traiterSheet(rows);
    // Réponse JSON
    res.status(200).json({
      success: true,
      message: `${demandes.length} demandes créées`,
      data: demandes
    });

  } catch (err) {
    console.error("Erreur controller:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

