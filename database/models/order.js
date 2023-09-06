const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

module.exports = () => {
  sequelize.define(
    "order",
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      address_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      recived_time: {
        type: DataTypes.DATE,
      },
      delevried_time: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "order", // Make sure this matches your table name
      timestamps: true,
      underscored: true,
    }
  );
};
