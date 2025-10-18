const express=require('express');
const router=express.Router();
const clubRoutes=require('./clubRoutes');
const authRoutes=require('./authRoutes');

router.use('/clubs',clubRoutes);
router.use('/auth',authRoutes);

module.exports=router;