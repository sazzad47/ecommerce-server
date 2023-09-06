const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

module.exports = () => {
  sequelize.define(
    "categoriesProperties",
    {
      property_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "categories_properties",
    }
  );
};
