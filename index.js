// index.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the authentication system!');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
