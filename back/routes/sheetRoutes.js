// // routes/sheetRoutes.js
const express = require("express");
const router = express.Router();
//const { lireSheet } = require("../services/googleSheetService"); // Importez directement le service

const sheetController = require("../controllers/sheetController");



router.post('/process-sheet', sheetController.processSheet);

module.exports = router;
