const express = require('express');
const router = express.Router();
const posteRoutes = require('./posteRoutes');
router.use('/postes', posteRoutes);




module.exports=router;


