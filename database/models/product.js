const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

module.exports = () => {
  sequelize.define(
    "product",
    {
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      short_description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      stock: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      is_real: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      description: {
        type: DataTypes.TEXT,
        defaultValue: "",
      },
      discount: {
        type: DataTypes.FLOAT,
        defaultValue: 0.0,
      },
      max_order: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      min_order: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      tableName: "product",
      timestamps: true,
      underscored: true,
    }
  );
};
