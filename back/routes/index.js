const express = require('express');
const router = express.Router();
const posteRoutes = require('./posteRoutes');
const authRoutes =  require('./authRoutes');
const clubRoutes=require('./clubRoutes');
const demandeAdhesionRoutes=require('./demandeAdhesionRoutes');
const annonceLogementRoutes=require('./annonceRouter');
const compagneRoutes=require('./compagneRoutes');
const etudiantRoutes=require('./etudiantRoutes');
const eventRoutes=require('./eventRoutes');
const sheetRoutes=require('./sheetRoutes');

router.use('/users',etudiantRoutes);
router.use('/compagnes',compagneRoutes);
router.use('/postes', posteRoutes);
router.use('/auth', authRoutes);
router.use('/clubs', clubRoutes);
router.use('/demandeAdhesion', demandeAdhesionRoutes);
router.use('/sheets', sheetRoutes); 
router.use('/events', eventRoutes);
router.use('/annonces', annonceLogementRoutes);




module.exports=router;


