const express = require("express");
const router = express.Router();
const { registerAdmin, loginAdmin } = require("../controllers/AdminsController");

const { CheckAdminEmail, CheckAdminPassword } = require("../middlewares/Login");

const {
    checkAdminEmailExists,
    encryptPassword,
  } = require("../middlewares/Registrations");

router
  .route("/register")
  .post(
    checkAdminEmailExists,
    encryptPassword,
    registerAdmin
  );
router.route("/login").post(CheckAdminEmail, CheckAdminPassword, loginAdmin);

module.exports = router;