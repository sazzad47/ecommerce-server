const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

module.exports = () => {
  sequelize.define(
    "site_pages",
    {
      terms: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      privacy: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      about: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: true,
      underscored: true,
      tableName: "site_pages",
    }
  );
};
