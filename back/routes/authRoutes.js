const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();

router.post('/', authController.register);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resendVerificationEmail', authController.resendVerificationEmail);

router.post('/google-login', authController.googleLogin);

router.put('/:id/pre-register',authController.infos);

router.post('/login', authController.login);

router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

router.put('/update-profile',authMiddleware, authController.updateUserProfile);

router.get('/me',authMiddleware,authController.me); 
module.exports = router;