const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

module.exports = () => {
  sequelize.define(
    "property",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      type: {
        type: DataTypes.ENUM("PROPERTY_TYPES"),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "property",
    }
  );
};
