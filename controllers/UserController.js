const { QueryTypes } = require("sequelize");
const sequelize = require("../database/connect");
const { models } = require("../database/connect");
const {
  getDashboardCustomers,
  getDashboardCustomersId,
} = require("../database/queries");
const { notFound } = require("../errors");
const { isHere } = require("../helpers/Validation");
const jwt = require("jsonwebtoken");
// Get all users
const getAllUsers = async (req, res) => {
  const users = await sequelize.query(getDashboardCustomers(), {
    type: QueryTypes.SELECT,
  });
  res.status(200).json(users);
};

const getDashUser = async (req, res) => {
  const { query } = req.params;
  let condition = "";
  if (isNaN(query)) {
    // If the query is not a number, search by name
    condition += `LOWER(u.first_name || ' ' || u.last_name) like '%${query.toLowerCase()}%'`;
  } else {
    // If the query is a number, search by user ID
    condition += `u.id = ${query}`;
  }
  const users = await sequelize.query(getDashboardCustomersId(condition), {
    type: QueryTypes.SELECT,
  });
  res.status(200).json(users);
};

// Create a new user
const createUser = async (req, res, next) => {
  const { firstName, lastName, email, phone } = req.body;
  const transaction = await sequelize.transaction();
  isHere(firstName);
  isHere(lastName);
  isHere(phone);
  const user = await models.user.create(
    {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      password: req.password,
    },
    {
      transaction,
    }
  );
  req.user_id = user.dataValues.id;
  req.trans = transaction;

  next();
};

// Update a user
const updateUser = async (req, res, next) => {
  const { id } = req.params;
  await models.user.update(req.body, {
    where: {
      id,
    },
  });
  next();
};

// Get a user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await models.user.findByPk(id);
  if (user) {
    res.status(200).json(user);
  } else {
    throw new notFound("No user with this ID", "");
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  await models.user.destroy({
    where: {
      id,
    },
  });
  res.status(200).json({ message: "User deleted successfully" });
};

const loginUser = async (req, res) => {
  const cart = await models.cart.findOne({
    where: {
      user_id: req.user.id,
    },
  });
  const address = await models.address.findAll({
    where: {
      user_id: req.user.id,
    },
  });
  const token = GenerateToken(req.user, address, cart);

  res.status(200).json({ token });
};


// Refresh the user's JWT token
const refreshUser = async (req, res) => {
  const { user_id } = req.body;

  const user = await models.user.findByPk(user_id);
  const cart = await models.cart.findOne({
    where: {
      user_id: user.id,
    },
  });
  const address = await models.address.findAll({
    order: ["created_at"],
    where: {
      user_id: user.id,
    },
  });
  const token = GenerateToken(user, address, cart);

  res.status(200).json({ token });
};

const GenerateToken = (user, address, cart) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.first_name + " " + user.last_name,
      phone: user.phone,
      cart: cart.id,
      adresses: [...address],
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "10d",
    }
  );
  return token;
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  loginUser,
  refreshUser,
  getDashUser,
};
