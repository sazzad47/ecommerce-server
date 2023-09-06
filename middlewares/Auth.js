// middleware to check that every request is authorized

const jwt = require("jsonwebtoken");
const { unAuthanticated } = require("../errors");
const authenticateUser = async (req, res, next) => {
  // get token from header
  const { authorization } = req.headers;
  // check if client sent the auth and in proper format
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new unAuthanticated("401 Un authorized", "re-login can solve this");
  }
  try {
    //get token
    const token = authorization.split(" ")[1];
    // verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      ignoreExpiration: false,
    });
    req.user = decoded;
    next();
  } catch (error) {
    const errorUnAuth = new unAuthanticated(
      error.message,
      "unAuthorized request re-login can solve this"
    );
    next(errorUnAuth);
  }
};

module.exports = authenticateUser;
