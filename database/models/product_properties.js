const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

module.exports = () => {
  sequelize.define(
    "productProperties",
    {
      property_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      property_value_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "product_properties",
    }
  );
};
