const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

module.exports = () => {
  sequelize.define(
    "slider_images",
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "slider_images",
    }
  );
};
