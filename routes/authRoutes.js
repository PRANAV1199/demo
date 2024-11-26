// routes/authRoutes.js

const express = require('express');
const { registerUser, loginUser,logoutUser } = require('../controllers/authController');
const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

//Logout Route
router.post('/logout', logoutUser);

module.exports = router;
