const { models } = require("../database/connect");
const { isHere } = require("../helpers/Validation");
const { getCartQuantity, getCarItems } = require("../database/queries");
const sequelize = require("../database/connect");
const { QueryTypes } = require("sequelize");
const { notFound } = require("../errors");

// Create a new cart
const createCart = async (req, res) => {
  let cart = await models.cart.findOne({
    where: {
      user_id: req.user_id,
    },
  });
  if (!cart) {
    cart = await models.cart.create(
      { user_id: req.user_id },
      {
        transaction: req.trans,
      }
    );
  }
  req.trans.commit();
  res.status(201).json({ cart });
};

// Add a new cart item
const addCartItem = async (req, res) => {
  const { product_id, quantity } = req.body;
  const { cart_id } = req.params;
  isHere(product_id);
  isHere(cart_id);
  isHere(quantity);
  const product = await models.product.findByPk(product_id);
  if (product) {
    await models.cart_item.create({
      product_id,
      cart_id,
      quantity,
    });
    res.status(200).json({ msg: "Done" });
  } else {
    throw new notFound("No product with this details");
  }
};

// Delete a cart item
const deleteCartItem = async (req, res) => {
  const { cart_id } = req.params;
  const { product_id } = req.query;

  await models.cart_item.destroy({
    where: {
      cart_id,
      product_id: parseInt(product_id),
    },
  });
  res.status(200).json({ message: "Cart item deleted successfully" });
};

// Update a cart item
const updateCartItem = async (req, res) => {
  const { cart_id } = req.params;
  const { quantity, product_id } = req.body;
  await models.cart_item.update(
    {
      quantity,
    },
    {
      where: {
        cart_id,
        product_id,
      },
    }
  );
  res.status(200).json({ message: "Cart item updated successfully" });
};

// Get all cart items in a specific cart
const getAllCartItems = async (req, res) => {
  const { cart_id } = req.params;
  isHere(cart_id);

  if (cart_id == -1) {
    res.status(200).json({ items: [], quantity: 0 });
    return;
  }

  const cartItems = await sequelize.query(getCarItems(cart_id), {
    type: QueryTypes.SELECT,
  });

  const cartQuantity = await sequelize.query(getCartQuantity(cart_id), {
    type: QueryTypes.SELECT,
  });
  res
    .status(200)
    .json({ items: [...cartItems], quantity: cartQuantity[0].total_items });
};

// Delete a cart item
const deleteAllCartItem = async (req, res) => {
  const { cart_id } = req.body;

  await models.cart_item.destroy({
    where: {
      cart_id,
    },
  });
  res.status(200).json({ message: "Cart item deleted successfully" });
};

module.exports = {
  createCart,
  addCartItem,
  deleteCartItem,
  updateCartItem,
  getAllCartItems,
  deleteAllCartItem,
};
