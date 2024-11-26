const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { jwtSecret } = require('../utils/jwtHelper');

const usersPath = path.join(__dirname, '../data/users.json');

// Token blacklist for invalidated tokens
const tokenBlacklist = new Set();

// Helper to read users from the file
const readUsersFromFile = () => {
  try {
    const data = fs.readFileSync(usersPath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users file:', err);
    return [];
  }
};

// Helper to write users to the file
const writeUsersToFile = (users) => {
  try {
    fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to users file:', err);
  }
};

// Register a new user
const registerUser = async (req, res) => {
  const { username, password, role } = req.body;
  console.log(role);
  if (!username || !password || !role) {
    return res.status(400).json({ message: 'Username, password, and role are required!' });
  }

  const users = readUsersFromFile();
  const existingUser = users.find(user => user.username === username);

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists!' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, username, password: hashedPassword, role };

  users.push(newUser);
  writeUsersToFile(users);

  res.status(201).json({ message: 'User registered successfully!' });
};

// Login user and return JWT
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required!' });
  }

  const users = readUsersFromFile();
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password!' });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json({ message: 'Invalid username or password!' });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '1h' });
  res.status(200).json({ message: 'Login successful!', token });
};

// Logout user by blacklisting the JWT
const logoutUser = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(400).json({ message: 'Token is required for logout!' });
  }

  try {
    // Verify token validity
    jwt.verify(token, jwtSecret);

    // Add token to the blacklist
    tokenBlacklist.add(token);

    res.status(200).json({ message: 'Logged out successfully!' });
  } catch (err) {
    return res.status(400).json({ message: 'Invalid or expired token!' });
  }
};

// Middleware to check if token is blacklisted
const checkTokenBlacklist = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (tokenBlacklist.has(token)) {
    return res.status(401).json({ message: 'This token has been logged out!' });
  }

  next();
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  checkTokenBlacklist,
};
