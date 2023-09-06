const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

const Cart = sequelize.define(
  "cart",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "cart",
    timestamps: true,
    underscored: true,
  }
);

module.exports = () => {
  Cart;
};
