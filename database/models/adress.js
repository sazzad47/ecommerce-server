const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

const Address = sequelize.define(
  "address",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "address",
    timestamps: true,
    underscored: true,
  }
);

module.exports = () => {
  Address;
};
