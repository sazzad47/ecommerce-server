const jwt = require("jsonwebtoken");

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
  loginAdmin,
};
