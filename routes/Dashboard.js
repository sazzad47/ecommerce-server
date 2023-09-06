// Import dependencies
const express = require("express");
const router = express.Router();
const multer_upload = require("../helpers/multer");

// Import controllers
const {
  initializeData,
  addSliders,
  getSliders,
  deleteSlider,
  updateSitePage,
  getSitePage,
} = require("../controllers/DashboardController");

// Define routes
router.route("/").get(initializeData);
router
  .route("/slider")
  .post(multer_upload.array("sliders"), addSliders)
  .get(getSliders);

router.route("/slider/:id").delete(deleteSlider);
router.route("/pages").get(getSitePage);
router.route("/pages/:id").put(updateSitePage);

// Export router
module.exports = router;
