const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();

router.post('/', authController.register);

//router.post('/google-login', authController.googleLogin);
//GET
//router.get('/me',authMiddleware,authController.me); 
module.exports = router;