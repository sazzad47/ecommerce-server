// Import dependencies
const express = require("express");
const router = express.Router();

// Import controllers
const {
  getRecommendations,
  getRecommendationsValues,
} = require("../controllers/RecommendationController");

// Define routes
router.route("/:id").get(getRecommendations);
router.route("/").get(getRecommendationsValues);

// Export router
module.exports = router;
