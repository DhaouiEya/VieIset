const express = require('express');
const router = express.Router();
const posteRoutes = require('./posteRoutes');
const authRoutes =  require('./authRoutes');
const clubRoutes=require('./clubRoutes');
const demandeAdhesionRoutes=require('./demandeAdhesionRoutes');


router.use('/postes', posteRoutes);
router.use('/auth', authRoutes);
router.use('/clubs', clubRoutes);
router.use('/demandeAdhesion', demandeAdhesionRoutes);
router.use('/events', require('./eventRoutes'));

module.exports=router;


