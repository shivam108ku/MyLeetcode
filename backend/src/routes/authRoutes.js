const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, deleteProfile, adminRegister,checkAuth, resetPassword, verifyEmail, logout } = require('../controllers/auth.controller');
const userMiddleware = require('../middleware/userMiddleware');
const {loginLimiter}  = require('../middleware/loginLimiter');
const verifyToken = require('../middleware/verifyToken')
const adminMiddleware = require('../middleware/adminMiddleware')


router.get('/check-auth',verifyToken ,checkAuth)

router.post('/register', register); // Register user via POST
router.post('/login', loginLimiter, login);       // Login via POST (credentials in req.body)
router.post('/logout', userMiddleware, logout);      // Logout usually GET or POST depending on design
router.post('/admin/register',adminMiddleware,adminRegister);
router.post('/verify-email',verifyEmail)
router.delete('/profile',userMiddleware,deleteProfile)


router.post('/forgot-password',forgotPassword);
router.post('/reset-password/:token',resetPassword);

module.exports = router;


