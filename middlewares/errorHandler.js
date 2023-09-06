/**
 * Error Handler Middleware
 *
 * This middleware function handles errors that occur during request processing.
 * It sends a JSON response containing error details, including error type,
 * error message, suggested fix (if provided), and the HTTP status code.
 *
 * @param {Error} err - The error object
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const errorHandlerMiddleware = async (err, req, res, next) => {
  // Determine the HTTP status code for the response
  const statusCode = err.statusCode || 500;

  // Prepare the JSON response object
  const jsonResponse = {
    type: err.constructor.name, // Type of the error (e.g., Error, ValidationError)
    msg: err.message, // Error message
    fixIt: err.howToFix, // Suggested fix for the error (if provided)
    status: statusCode, // HTTP status code
    err, // The complete error object
  };

  // Send the JSON response with appropriate status code
  res.status(statusCode).json(jsonResponse);
};

// Export the error handler middleware
module.exports = errorHandlerMiddleware;
