const CustomError = require("./CustomError");
const { StatusCodes } = require("http-status-codes");
class notFound extends CustomError {
  constructor(message, howToFix) {
    super(message, howToFix);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

module.exports = notFound;
