/**
 * Not Found Error Handler
 *
 * This function is responsible for handling 404 errors, which occur when a route or HTTP method is not supported.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const not_found = (req, res) =>
  res
    .status(404)
    .send(
      "The route is incorrect or you requested a route with an unsupported HTTP method"
    );

// Export the not_found function to be used as an error handling middleware
module.exports = not_found;
