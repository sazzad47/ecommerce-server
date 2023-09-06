const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  loginUser,
  refreshUser,
  getDashUser,
} = require("../controllers/UserController");

const {
  checkEmailExists,
  encryptPassword,
} = require("../middlewares/Registrations");

const { CheckEmail, CheckPassword } = require("../middlewares/Login");
const { createCart } = require("../controllers/cartController");
const {
  createAddress,
  updateAddress,
} = require("../controllers/AddressController");
router
  .route("/")
  .get(getAllUsers)
  .post(
    checkEmailExists,
    encryptPassword,
    createUser,
    createAddress,
    createCart
  );

router
  .route("/:id")
  .put(updateUser, refreshUser)
  .delete(deleteUser)
  .get(getUserById);
router.route("/login").post(CheckEmail, CheckPassword, loginUser);
router.route("/address").post(createAddress, refreshUser);
router.route("/address/:address_id").put(updateAddress, refreshUser);
router.route("/dash_user/:query").get(getDashUser);

module.exports = router;
