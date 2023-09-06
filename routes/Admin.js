const express = require("express");
const router = express.Router();
const { loginAdmin } = require("../controllers/AdminsController");

const { CheckAdminEmail, CheckAdminPassword } = require("../middlewares/Login");

router.route("/login").post(CheckAdminEmail, CheckAdminPassword, loginAdmin);

module.exports = router;
