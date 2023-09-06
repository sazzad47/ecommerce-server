const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

module.exports = () => {
  sequelize.define(
    "category",
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image_url: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      banner_url: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
    },
    {
      tableName: "category",
      timestamps: true,
      underscored: true,
    }
  );
};
