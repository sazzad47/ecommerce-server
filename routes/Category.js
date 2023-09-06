const router = require("express").Router();
const {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  categoryProperties,
  getAllProductsInCategory,
  getCategoryProp,
  updateCategoryName,
  addOneProp,
  updateCategoryImage,
} = require("../controllers/CategoryController");
const multer_upload = require("../helpers/multer");

// multer_upload.array helps to get the files send in the route and upload them in uploads folder
// .array because in createCategory controller recieves two images in an array called images

router
  .route("/")
  .post(multer_upload.array("images", 2), createCategory, categoryProperties);
router.route("/:id").delete(deleteCategory).put(updateCategoryName);
router.route("/all").get(getAllCategories);
router.route("/:id").get(getCategoryById);
router.route("/products/:id").post(getAllProductsInCategory);
router.route("/prop/add").post(addOneProp);
router.route("/prop/:id").get(getCategoryProp);
router
  .route("/image/:id")
  .put(multer_upload.single("image"), updateCategoryImage);

module.exports = router;
//category
