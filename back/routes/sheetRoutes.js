// // routes/sheetRoutes.js
const express = require("express");
const router = express.Router();

const sheetController = require("../controllers/sheetController");
router.post('/process-sheet', sheetController.processSheet);
router.post('/get-data', sheetController.getSheetData);


module.exports = router;
