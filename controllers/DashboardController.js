const { QueryTypes } = require("sequelize");
const sequelize = require("../database/connect");
const {
  getCardsData,
  getOrdersPerDay,
  getProductViews,
} = require("../database/queries");
const { uploadProductPhotos } = require("../helpers/Methods");
const { models } = require("../database/connect");
const { notFound } = require("../errors");

const initializeData = async (req, res) => {
  const number_of_users = await sequelize.query(getCardsData("totalUsers"), {
    type: QueryTypes.SELECT,
  });
  const number_of_orders = await sequelize.query(getCardsData("totalOrders"), {
    type: QueryTypes.SELECT,
  });
  const total_of_orders = await sequelize.query(getCardsData("totalAmount"), {
    type: QueryTypes.SELECT,
  });

  const orders_per_day = await sequelize.query(getOrdersPerDay(), {
    type: QueryTypes.SELECT,
  });

  
  const total_of_pending_orders = await sequelize.query(
    getCardsData("PendingAmount"),
    {
      type: QueryTypes.SELECT,
    }
  );

  const total_views = await sequelize.query(getProductViews(), {
    type: QueryTypes.SELECT,
  });

  res.status(200).json({
    number_of_users: number_of_users[0].users_this_month,
    number_of_orders: number_of_orders[0].orders_this_month,
    total_of_orders: total_of_orders[0].total_this_month,
    total_of_pending_orders: total_of_pending_orders[0].pending_this_month,
    orders_per_day,
    total_views,
  });
};

const addSliders = async (req, res) => {
  const transaction = await sequelize.transaction();
  const images = await uploadProductPhotos(req.files);

  await Promise.all(
    images.map(async (image) => {
      await models.slider_images.create(
        {
          url: image,
        },
        { transaction }
      );
    })
  );

  await transaction.commit();
  res.status(200).json({ msg: "Done" });
};

const getSliders = async (req, res) => {
  const images = await models.slider_images.findAll();
  res.status(200).json(images);
};

const deleteSlider = async (req, res) => {
  const { id } = req.params;
  const image = await models.slider_images.findByPk(id);
  if (image) {
    image.destroy();
    res.status(200).json({ msg: "Deleted" });
  } else {
    throw new notFound("No image with this id");
  }
};

const updateSitePage = async (req, res) => {
  const { id } = req.params;
  const { page, value } = req.body;
  await models.site_pages.update(
    { [page]: value },
    {
      where: {
        id,
      },
    }
  );
  res.status(200).json({ msg: "Done" });
};

const getSitePage = async (req, res) => {
  const pages = await models.site_pages.findAll();
  res.status(200).json(pages);
};

module.exports = {
  initializeData,
  addSliders,
  getSliders,
  deleteSlider,
  updateSitePage,
  getSitePage,
};
