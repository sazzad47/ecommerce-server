const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

const CartItem = sequelize.define(
  "cart_item",
  {
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.REAL,
      defaultValue: 1.0,
    },
  },
  {
    tableName: "cart_items",
    timestamps: true,
    underscored: true,
  }
);

module.exports = () => {
  CartItem;
};
