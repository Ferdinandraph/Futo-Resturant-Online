const express = require('express');
const { registerUser, verifyUser, loginUser} = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);    // User registration route
router.get('/verify/:token', verifyUser);  // Email verification route
router.post('/login', loginUser);          // Login registration route



module.exports = router;
