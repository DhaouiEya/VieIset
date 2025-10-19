const express = require('express');
const router = express.Router();
const posteRoutes = require('./posteRoutes');
const authRoutes =  require('./authRoutes');
const clubRoutes=require('./clubRoutes');


router.use('/postes', posteRoutes);
router.use('/auth', authRoutes);
router.use('/clubs', clubRoutes);


module.exports=router;


