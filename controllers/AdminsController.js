const jwt = require("jsonwebtoken");
const { models } = require("../database/connect");

const registerAdmin = async (req, res) => {
  try {
    const { name, email } = req.body;

    // Create a new admin
    const admin = await models.admins.create({ name, email, password: req.password });

    res.status(201).json({ message: 'Admin registered successfully', admin });
  } catch (error) {
    console.error('Error in registerAdmin:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const loginAdmin = async (req, res) => {
  const token = GenerateToken(req.admin);

  res.status(200).json({ token });
};

const GenerateToken = (admin) => {
  const token = jwt.sign(
    {
      ...admin.dataValues,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1hr",
    }
  );
  return token;
};

module.exports = {
  registerAdmin,
  loginAdmin,
};
