const { StatusCodes } = require("http-status-codes");
const CustomError = require("./CustomError");
class badRequest extends CustomError {
  constructor(message, howToFix) {
    super(message, howToFix);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}

module.exports = badRequest;
