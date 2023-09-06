// Import dependencies
const express = require("express");
const router = express.Router();

// Import controllers
const {
  createOrder,
  getOrderById,
  getUserNewesetOrders,
  getAllOrders,
  getAllUserOrders,
  getOrderITems,
  updateOrderStatus,
  updateItems,
} = require("../controllers/orderController");
const { deleteAllCartItem } = require("../controllers/cartController");

// Define routes
router
  .route("/")
  .post(createOrder, deleteAllCartItem)
  .get(getAllOrders)
  .put(updateOrderStatus, updateItems);
router.route("/user/recent").get(getUserNewesetOrders);
router.route("/user/all/:user_id").get(getAllUserOrders);
router.route("/:id").get(getOrderById);
router.route("/items/:order_id").get(getOrderITems);

// Export router
module.exports = router;
