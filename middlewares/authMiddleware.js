// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../utils/jwtHelper');

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Middleware to check if the user has the required role
const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role.toUpperCase() !== role.toUpperCase()) {
        console.log(req.user.role,role);
      return res.status(403).json({ message: 'Forbidden. You do not have the required role.' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
