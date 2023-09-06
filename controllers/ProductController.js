const sequelize = require("../database/connect");
const {
  getOneProduct,
  getProductPropsValues,
  getOneProductByName,
  getOneProductByNameV2,
} = require("../database/queries");
const { models } = require("../database/connect");
const { notFound } = require("../errors");
const { uploadProductPhotos } = require("../helpers/Methods");
const { QueryTypes } = require("sequelize");

const createProduct = async (req, _, next) => {
  const transaction = await sequelize.transaction();
  const product = await models.product.create(req.body, { transaction });
  req.product = product;
  req.trans = transaction;
  next();
};

const uploadProductImages = async (req, res, next) => {
  const transaction = req.trans; // Reuse the existing transaction
  const images = await uploadProductPhotos(req.files);
  await Promise.all(
    images.map(async (image) => {
      await models.productImages.create(
        {
          product_id: req.product.id,
          image_url: image,
        },
        { transaction }
      );
    })
  );
  if (req.body.properties) {
    next();
  } else {
    await transaction.commit();
    res.status(201).json({ product: req.product });
  }
};

const productProperties = async (req, res) => {
  const transaction = req.trans;
  const { properties } = req.body;
  const JSONProperties = JSON.parse(properties);
  const { id } = req.product;
  await Promise.all(
    JSONProperties.map(async (prop) => {
      await models.productProperties.create(
        {
          property_id: prop.property_id,
          property_value_id: prop.property_value_id,
          product_id: id,
        },
        { transaction }
      );
    })
  );
  await transaction.commit();
  res.status(201).json({ product: req.product });
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const [updated] = await models.product.update(req.body, {
    where: { id: id },
  });
  if (updated) {
    const updatedProduct = await models.product.findOne({ where: { id: id } });
    res.status(200).json(updatedProduct);
  } else {
    throw new notFound("Product not found", "");
  }
};

const deleteProductProp = async (req, res) => {
  const { id, prop_id } = req.params;
  const deleted = await models.productProperties.destroy({
    where: { product_id: id, property_id: prop_id },
  });
  if (deleted) {
    res.status(204).send("deleted");
  } else {
    throw new notFound("not found", "");
  }
};

const updateProductProp = async (req, res) => {
  const { id, prop_id } = req.params;
  const [updated] = await models.productProperties.update(req.body, {
    where: { product_id: id, property_id: prop_id },
  });
  if (updated) {
    const updatedProduct = await models.product.findOne({ where: { id: id } });
    res.status(200).json(updatedProduct);
  } else {
    throw new notFound("Product not found", "");
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const deleted = await models.product.destroy({
    where: { id: id },
  });
  if (deleted) {
    res.status(204).send("Product deleted");
  } else {
    throw new notFound("Product not found", "");
  }
};

const incrementViews = async (req, res, next) => {
  const { id } = req.params;
  await sequelize.models.product.increment("views", {
    where: {
      id,
    },
  });
  next();
};

const getProductById = async (req, res, next) => {
  const { id } = req.params;
  const { productpage } = req.query;
  const product = await sequelize.query(getOneProduct(id), {
    type: QueryTypes.SELECT,
  });
  if (product) {
    if (productpage) {
      req.product = product[0];
      next();
    } else {
      res.status(200).json({ product: product[0] });
    }
  } else {
    throw new notFound("Product not found", "");
  }
};

const getProductByName = async (req, res, next) => {
  const { name } = req.query;
  const product = await sequelize.query(getOneProductByName(name), {
    type: QueryTypes.SELECT,
  });
  if (product) {
    res.status(200).json({ products: product });
  } else {
    throw new notFound("Product not found", "");
  }
};

const getProductByNameV2 = async (req, res, next) => {
  const { name } = req.query;
  const product = await sequelize.query(getOneProductByNameV2(name), {
    type: QueryTypes.SELECT,
  });
  if (product) {
    res.status(200).json({ products: product });
  } else {
    throw new notFound("Product not found", "");
  }
};

const getProductImages = async (req, res, next) => {
  const { pid } = req.query;
  const images = await models.productImages.findAll({
    where: {
      product_id: req.product?.id || pid,
    },
  });
  req.images = images;
  if (pid) {
    res.status(200).json(images);
  } else {
    next();
  }
};

const DeleteProductImage = async (req, res) => {
  const { id } = req.params;
  await models.productImages.destroy({
    where: {
      id,
    },
  });
  res.status(200).json({ msg: "Done" });
};

const getProductProperties = async (req, res) => {
  const { id } = req.params;
  const properties = await sequelize.query(getProductPropsValues(id), {
    type: QueryTypes.SELECT,
  });

  res
    .status(200)
    .json({ product: { ...req.product, images: req.images, properties } });
};

const getAllProducts = async (req, res) => {
  const products = await models.product.findAll({ order: ["created_at"] });
  res.status(200).json(products);
};

const addImageToProduct = async (req, res, next) => {
  const { id } = req.params;
  const images = await uploadProductPhotos(req.files);
  await Promise.all(
    images.map(async (image) => {
      await models.productImages.create({
        product_id: id,
        image_url: image,
      });
    })
  );

  res.status(201).json({ msg: "Done" });
};

const getProductPropertiesV2 = async (req, res) => {
  const { id } = req.params;

  const { category_id } = await models.product.findByPk(id);

  const properties = await sequelize.query(getProductPropsValues(id), {
    type: QueryTypes.SELECT,
  });

  const category_props = await models.categoriesProperties.findAll({
    attributes: [],
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
      category_id: category_id,
    },
  });

  res.status(200).json({ properties, category_props });
};

const createProductProperty = async (req, res) => {
  const { id, prop_id } = req.params;
  const { value_id } = req.body;
  const prop = await models.productProperties.create({
    property_id: prop_id,
    property_value_id: value_id,
    product_id: id,
  });

  res.status(201).json({ msg: "Created", prop });
};

module.exports = {
  createProduct,
  uploadProductImages,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  productProperties,
  deleteProductProp,
  updateProductProp,
  getProductImages,
  getProductProperties,
  incrementViews,
  getProductByName,
  DeleteProductImage,
  addImageToProduct,
  getProductPropertiesV2,
  createProductProperty,
  getProductByNameV2,
};
