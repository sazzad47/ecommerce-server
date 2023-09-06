const express = require("express");
const router = express.Router();
const multer_upload = require("../helpers/multer");

const {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  uploadProductImages,
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
} = require("../controllers/ProductController");

router
  .route("/")
  .get(getAllProducts)
  .post(
    multer_upload.array("product_images"),
    createProduct,
    uploadProductImages,
    productProperties
  );
router.route("/search").get(getProductByName);
router.route("/q/search").get(getProductByNameV2);
router.route("/images").get(getProductImages);
router
  .route("/images/:id")
  .delete(DeleteProductImage)
  .post(multer_upload.array("images"), addImageToProduct);

router
  .route("/dash/:id")
  .get(getProductById, getProductImages, getProductProperties);

router
  .route("/:id")
  .get(incrementViews, getProductById, getProductImages, getProductProperties)
  .put(updateProduct)
  .delete(deleteProduct);

router.route("/props/get/:id").get(getProductPropertiesV2);

router
  .route("/:id/:prop_id")
  .delete(deleteProductProp)
  .put(updateProductProp)
  .post(createProductProperty);

module.exports = router;
