const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

const UsersCart = sequelize.define(
  "UsersCart",
  {
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "users_cart",
    timestamps: true,
    underscored: true,
  }
);

module.exports = () => {
    UsersCart;
  };
  