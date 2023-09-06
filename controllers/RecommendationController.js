const { QueryTypes } = require("sequelize");
const sequelize = require("../database/connect");
const {
  getProductsForRecommendationSystem,
  getClinetPurchaseHistory,
} = require("../database/queries");
const axios = require("axios");
const { Op } = require("sequelize");
const { models } = require("../database/connect");

const getRecommendations = async (req, res) => {
  const { id } = req.params;

  // this happen if the user is not logged in
  if (id == -1) {
    res.status(200).json({
      recommendProducts: [],
    });
    return;
  }

  const products = await sequelize.query(getProductsForRecommendationSystem(), {
    type: QueryTypes.SELECT,
  });

  const client = await sequelize.query(getClinetPurchaseHistory(id), {
    type: QueryTypes.SELECT,
  });

  const response = await axios.post("http://127.0.0.1:6000/recommend", {
    client,
    products,
  });

  const recommendProducts = await models.product.findAll({
    where: {
      name: {
        [Op.in]: [...response.data.recommended],
      },
    },
    include: [
      {
        model: models.productImages,
        as: "images",
        attributes: ["image_url"],
        limit: 1,
      },
    ],
  });

  await models.recommendations.create({
    user_id: id,
    value: response.data.recommended.join(","),
  });

  res.status(200).json({
    recommendProducts: recommendProducts,
    names: response.data.recommended,
  });
};

const getRecommendationsValues = async (req, res) => {
  const recommendations = await models.recommendations.findAll();
  res.status(200).json(recommendations);
};

module.exports = {
  getRecommendations,
  getRecommendationsValues,
};
