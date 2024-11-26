const { readUsersFromFile } = require('../utils/fileHelper');

// Get all users
const getUsers = (req, res) => {
  const users = readUsersFromFile();
  res.status(200).json({ users });
};

module.exports = { getUsers };
