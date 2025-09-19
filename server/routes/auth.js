const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// @route   POST /api/v1/auth/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/v1/auth/login
// @desc    Authenticate user and get token
router.post('/login', loginUser);

module.exports = router;