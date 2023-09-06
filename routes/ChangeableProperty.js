// A feature for future not used yet

const express = require("express");
const router = express.Router();
const {
  createChangeableProperty,
  deleteChangeableProperty,
  getAllChangeableProperties,
  getChangeableProperty,
  createChangeablePropertyValue,
  deleteChangeablePropertyValue,
  getAllChangeablePropertyValues,
  updateChangeableProperty,
} = require("../controllers/ChangeablePropertyController");

router
  .route("/")
  .get(getAllChangeableProperties)
  .post(createChangeableProperty);

router
  .route("/:id")
  .get(getChangeableProperty)
  .put(updateChangeableProperty)
  .delete(deleteChangeableProperty);

router
  .route("/values/:id")
  .get(getAllChangeablePropertyValues)
  .post(createChangeablePropertyValue);

router.route("/values/:valueId").delete(deleteChangeablePropertyValue);

module.exports = router;
