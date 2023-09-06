const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

const ChangablePropertyValue = sequelize.define(
  "changable_property_value",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    changeable_property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      field: "created_at",
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      field: "updated_at",
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "changable_property_values",
    timestamps: true,
    underscored: true,
  }
);

module.exports = () => {ChangablePropertyValue};
