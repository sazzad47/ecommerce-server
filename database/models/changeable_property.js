const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

const ChangeableProperty = sequelize.define(
  "changeable_property",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("PROPERTY_TYPES"),
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
    tableName: "changeable_property",
    timestamps: true,
    underscored: true,
  }
);

module.exports = () => {ChangeableProperty};
