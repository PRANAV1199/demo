// routes/userRoutes.js

const express = require('express');
const { getUsers } = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middlewares/authMiddleware');
const router = express.Router();

// Example protected route - only accessible by an admin
router.get('/all', authenticateToken, authorizeRole('admin'), getUsers);

module.exports = router;
