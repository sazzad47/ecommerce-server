const { DataTypes } = require("sequelize");
const sequelize = require("../connect");

const Recommendation = sequelize.define(
  "recommendations",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "recommendations",
    timestamps: true,
    underscored: true,
  }
);

module.exports = () => {
  Recommendation;
};
