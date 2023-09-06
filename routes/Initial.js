// Import dependencies
const express = require("express");
const router = express.Router();

// Import controllers
const { getHomePage } = require("../controllers/InitialController");
const {
  getRecommendations,
} = require("../controllers/RecommendationController");

// Define routes
router.route("/").get(getHomePage, getRecommendations);
// Export router
module.exports = router;
