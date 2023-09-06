// Import dependencies
const express = require("express");
const router = express.Router();

// Import controllers
const {
  addCartItem,
  deleteCartItem,
  updateCartItem,
  getAllCartItems,
  createCart,
} = require("../controllers/cartController");

// Define routes
router.route("/").post(createCart);
router
  .route("/:cart_id/items")
  .get(getAllCartItems)
  .post(addCartItem)
  .put(updateCartItem)
  .delete(deleteCartItem);
router.delete("/:id/items", deleteCartItem);

// Export router
module.exports = router;
