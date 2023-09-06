const express = require("express");
const router = express.Router();
const {
  getAllProperties,
  createProperty,
  deleteProperty,
  updateProperty,
  getProperty,
  deleteValue,
  UpdateValue,
  getAllPropertyValues,
  addValuesToProperty,
} = require("../controllers/PropertyController");

router.route("/").get(getAllProperties).post(createProperty);

router
  .route("/:id")
  .put(updateProperty)
  .delete(deleteProperty)
  .get(getProperty);

router
  .route("/values/:id")
  .delete(deleteValue)
  .put(UpdateValue)
  .get(getAllPropertyValues)
  .post(addValuesToProperty);

module.exports = router;
