const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

module.exports = () => {
  sequelize.define(
    "order_item",
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.FLOAT,
        defaultValue: 1.0,
      },
      total_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    },
    {
      tableName: "order_items",
      timestamps: true,
      underscored: true,
    }
  );
};
