const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

module.exports = () => {
  sequelize.define(
    "productImages",
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "product_images",
    }
  );
};
