const { QueryTypes } = require("sequelize");
const sequelize = require("../database/connect");
const { models } = require("../database/connect");
const {
  getUserRecentOrders,
  getDashboardOrders,
  getDashboardOrdersId,
} = require("../database/queries");
const { notFound } = require("../errors");

const createOrder = async (req, res, next) => {
  const { user_id, address_id, total, status, recived_time } = req.body;
  const transaction = await sequelize.transaction();

  // Using try catch so i can rollback this transaction
  try {
    const order = await models.order.create(
      {
        user_id,
        address_id,
        total,
        status,
        recived_time,
      },
      {
        transaction,
      }
    );

    const { items } = req.body;

    for (const item of items) {
      await models.order_item.create(
        {
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          total_price: item.total,
        },
        {
          transaction,
        }
      );
    }

    await transaction.commit();

    next();
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const getOrderById = async (req, res) => {
  const { id } = req.params;

  const order = await sequelize.query(getDashboardOrdersId(id), {
    type: QueryTypes.SELECT,
  });

  if (order) {
    res.status(200).json(order);
  } else {
    throw new notFound("No order with this ID", "");
  }
};

const getUserNewesetOrders = async (req, res) => {
  const { user_id } = req.query;

  const orders = await sequelize.query(getUserRecentOrders(user_id), {
    type: QueryTypes.SELECT,
  });

  res.status(200).json({ orders });
};

const getAllUserOrders = async (req, res) => {
  const { user_id } = req.params;
  const orders = await models.order.findAll({
    where: {
      user_id,
    },
    order: [["created_at", "DESC"]],
    attributes: ["total", "status", "created_at", "updated_at", "id"],
    include: [
      {
        model: models.order_item,
        attributes: ["id", "quantity", "total_price"],
        include: [
          {
            model: models.product,
            as: "product",
            attributes: ["id", "name"],
            include: [
              {
                model: models.productImages,
                as: "images",
                attributes: ["image_url"],
                limit: 1,
              },
            ],
          },
        ],
      },
    ],
  });

  res.status(200).json(orders);
};

const getAllOrders = async (req, res) => {
  const orders = await sequelize.query(getDashboardOrders(), {
    type: QueryTypes.SELECT,
    raw: true,
  });

  res.status(200).json(orders);
};

const getOrderITems = async (req, res) => {
  const { order_id } = req.params;
  const items = await models.order_item.findAll({
    where: {
      order_id,
    },

    include: [
      {
        model: models.product,
        as: "product",
        attributes: ["id", "name"],
        include: [
          {
            model: models.productImages,
            as: "images",
            attributes: ["image_url"],
            limit: 1,
          },
        ],
      },
    ],
  });

  res.status(200).json(items);
};

const updateOrderStatus = async (req, res, next) => {
  const { order_id, status } = req.body;

  const order = await models.order.findByPk(order_id);

  if (!order) {
    throw new notFound("No order with this ID", "");
  }

  await order.update({
    status,
  });

  next();
};

const updateItems = async (req, res) => {
  const { items, status } = req.body;
  if (status == "DELIVERED") {
    for (let index = 0; index < items.length; index++) {
      await models.product.decrement("stock", {
        by: items[index].quantity,
        where: {
          id: items[index].product.id,
        },
      });
    }
  }

  res.status(200).json({ message: "Order updated successfully" });
};

module.exports = {
  createOrder,
  getOrderById,
  getUserNewesetOrders,
  getAllOrders,
  getAllUserOrders,
  getOrderITems,
  updateOrderStatus,
  updateItems,
};
