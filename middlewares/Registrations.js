// Import custom error classes and required modules
const { badRequest } = require("../errors");
const { models } = require("../database/connect");
const { isHere } = require("../helpers/Validation");
const bcrypt = require("bcryptjs");

// Middleware to check if a user with the provided email already exists
const checkEmailExists = async (req, res, next) => {
  const { email } = req.body;
  isHere(email); // Validate that the email is present

  // Search for a user with the provided email
  const user = await models.user.findOne({ where: { email } });

  // If user already exists, throw a badRequest error
  if (user) {
    throw new badRequest("Email is already registered", "Try another email");
  } else {
    next(); // Proceed to the next middleware
  }
};

// Middleware to check if a admin with the provided email already exists
const checkAdminEmailExists = async (req, res, next) => {
  const { email } = req.body;
  isHere(email); // Validate that the email is present

  // Search for a admin with the provided email
  const admin = await models.admins.findOne({ where: { email } });

  // If admin already exists, throw a badRequest error
  if (admin) {
    throw new badRequest("Email is already registered", "Try another email");
  } else {
    next(); // Proceed to the next middleware
  }
};

// Middleware to encrypt the provided password before user registration
const encryptPassword = async (req, res, next) => {
  const { password } = req.body;
  isHere(password); // Validate that the password is present

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Store the hashed password in the request object for further use
  req.password = hashedPassword;

  next(); // Proceed to the next middleware
};

// Export the middleware functions as an object
module.exports = {
  checkEmailExists,
  checkAdminEmailExists,
  encryptPassword,
};
