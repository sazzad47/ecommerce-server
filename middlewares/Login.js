// Import custom error classes and required modules
const { notFound, unAuthanticated } = require("../errors");
const { models } = require("../database/connect");
const { isHere } = require("../helpers/Validation");
const bcrypt = require("bcryptjs");

// Middleware to check if a user with the provided email exists
const CheckEmail = async (req, res, next) => {
  const { email } = req.body;
  isHere(email); // Validate that the email is present

  // Search for a user with the provided email
  const user = await models.user.findOne({
    where: {
      email,
    },
  });

  // If user doesn't exist, throw a notFound error
  if (!user) {
    throw new notFound("No user with this email", "");
  } else {
    req.user = user; // Attach the user object to the request
    next(); // Proceed to the next middleware
  }
};

// Middleware to check if the provided password matches the user's password
const CheckPassword = async (req, res, next) => {
  const { password } = req.body;
  isHere(password); // Validate that the password is present

  // Compare the provided password with the user's hashed password
  const match = await bcrypt.compare(password, req.user.password);

  // If passwords don't match, throw an unAuthanticated error
  if (!match) {
    throw new unAuthanticated("Incorrect password", "");
  } else {
    next(); // Proceed to the next middleware
  }
};

// Middleware to check if an admin with the provided email exists
const CheckAdminEmail = async (req, res, next) => {
  const { email } = req.body;
  isHere(email); // Validate that the email is present

  // Search for an admin with the provided email
  const admin = await models.admins.findOne({
    where: {
      email,
    },
  });

  // If admin doesn't exist, throw a notFound error
  if (!admin) {
    throw new notFound("Incorrect Information", "");
  } else {
    req.admin = admin; // Attach the admin object to the request
    next(); // Proceed to the next middleware
  }
};

// Middleware to check if the provided password matches the admin's password
const CheckAdminPassword = async (req, res, next) => {
  const { password } = req.body;
  isHere(password); // Validate that the password is present

  // Compare the provided password with the admin's hashed password
  const match = await bcrypt.compare(password, req.admin.password);

  // If passwords don't match, throw an unAuthanticated error
  if (!match) {
    throw new unAuthanticated("Incorrect Information", "");
  } else {
    next(); // Proceed to the next middleware
  }
};

// Export all the middleware functions as an object
module.exports = {
  CheckEmail,
  CheckPassword,
  CheckAdminEmail,
  CheckAdminPassword,
};
