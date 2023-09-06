const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

module.exports = () => {
  sequelize.define(
    "PropertyValue",
    {
      property_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "property_values",
    }
  );
};
