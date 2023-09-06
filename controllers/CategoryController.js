const { models } = require("../database/connect");
const sequelize = require("../database/connect");
const {
  getProducts,
  getCategoryProps,
  getAllCategoriesData,
} = require("../database/queries");
const { isHere } = require("../helpers/Validation");
const { uploadCategoryPhotos, uploadOnePhoto } = require("../helpers/Methods");
const { notFound } = require("../errors");
const { QueryTypes } = require("sequelize");

const createCategory = async (req, res, next) => {
  const { title, properties } = req.body;
  isHere(title);
  const { image_url, banner_url } = await uploadCategoryPhotos(req.files);
  const category = await models.category.create({
    title,
    image_url,
    banner_url,
  });
  req.category = category;
  if (properties) {
    next();
  } else {
    res.status(201).json({ category });
  }
};

const categoryProperties = async (req, res) => {
  const { properties } = req.body;
  properties.split(",").forEach(async (prop) => {
    await models.categoriesProperties.create({
      property_id: parseInt(prop),
      category_id: req.category.id,
    });
  });
  res.status(201).json({ category: req.category });
};

const getAllCategories = async (req, res) => {
  const categories = await sequelize.query(getAllCategoriesData(), {
    type: QueryTypes.SELECT,
  });
  res.status(200).json(categories);
};

const deleteCategory = async (req, res) => {
  const category = await models.category.findByPk(req.params.id);
  if (!category) {
    return res.status(404).json({ msg: "Category not found" });
  }
  await category.destroy();
  res.json({ msg: "Category deleted" });
};

const getCategoryById = async (req, res) => {
  const category = await models.category.findByPk(req.params.id);
  const Props = await sequelize.query(getCategoryProps(req.params.id), {
    type: QueryTypes.SELECT,
  });
  if (!category) {
    throw new notFound("No category with this id", "");
  }
  res.json({ category, Props });
};

const getAllProductsInCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { limit, page } = req.query;
  const { filter } = req.body;
  const category = await models.category.findByPk(categoryId);
  if (!category) {
    throw new notFound("No category with this id", "");
  }
  const products = await sequelize.query(
    getProducts(categoryId, limit, page, filter || {}),
    {
      type: QueryTypes.SELECT,
    }
  );

  let productsCount = 0;
  if (filter) {
    productsCount = products.length;
  } else {
    productsCount = await models.product.count({
      where: {
        category_id: categoryId,
      },
    });
  }

  res.status(200).json({
    products,
    productsCount,
  });
};

const getCategoryProp = async (req, res) => {
  const props = await models.categoriesProperties.findAll({
    attributes: ["id"],
    include: [
      {
        model: models.property,
        attributes: ["id", "name"],
        include: [
          {
            model: models.PropertyValue,
            attributes: ["value", "id"],
            as: "values",
          },
        ],
      },
    ],
    where: {
      category_id: req.params.id,
    },
  });
  res.json(props);
};

const updateCategoryName = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  await models.category.update(
    {
      title,
    },
    {
      where: {
        id,
      },
    }
  );

  res.json({ msg: "Category name updated" });
};

const addOneProp = async (req, res) => {
  const { id, prop_id } = req.body;
  const prop = await models.categoriesProperties.create({
    property_id: prop_id,
    category_id: id,
  });
  res.status(201).json({ prop });
};

const updateCategoryImage = async (req, res) => {
  const { id } = req.params;
  const { attribute } = req.body;
  const url = await uploadOnePhoto(req.file);
  await models.category.update(
    {
      [attribute]: url,
    },
    {
      where: {
        id,
      },
    }
  );
  res.status(200).json({ msg: "Updated Succefully" });
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  deleteCategory,
  categoryProperties,
  getAllProductsInCategory,
  getCategoryProp,
  updateCategoryName,
  addOneProp,
  updateCategoryImage,
};
