const express = require('express');
const router = express.Router();
const posteRoutes = require('./posteRoutes');
const authRoutes =  require('./authRoutes');
const clubRoutes=require('./clubRoutes');
const eventRoutes = require('./eventRoutes');
//j'ai ajouter cette ligne pour les routes des evenements <--NH
router.use('/postes', posteRoutes);
router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/clubs', clubRoutes);

module.exports=router;


