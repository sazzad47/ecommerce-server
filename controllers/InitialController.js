const { models } = require("../database/connect");
const { Op } = require("sequelize");

const getHomePage = async (req, res) => {
  const Deals = await models.product.findAll({
    where: {
      discount: {
        [Op.gt]: 0,
      },
    },
    limit: 5,
    order: [["discount", "DESC"]],
    include: [
      {
        model: models.productImages,
        as: "images",
        attributes: ["image_url"],
      },
    ],
  });
  const SliderImages = await models.slider_images.findAll();
  const MostViwed = await models.product.findAll({
    limit: 1,
    order: [["views", "DESC"]],
    include: [
      {
        model: models.productImages,
        as: "images",
        attributes: ["image_url"],
      },
    ],
  });

  const newestProducts = await models.product.findAll({
    limit: 5,
    order: [["created_at", "DESC"]],
    include: [
      {
        model: models.productImages,
        as: "images",
        attributes: ["image_url"],
      },
    ],
  });
  res
    .status(200)
    .json({ Deals, SliderImages, MostViwed: MostViwed[0], newestProducts });
};

module.exports = {
  getHomePage,
};
