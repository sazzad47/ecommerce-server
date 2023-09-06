const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

const User = sequelize.define(
  "admins",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "admins",
    timestamps: true,
    underscored: true,
  }
);

module.exports = () => {User};