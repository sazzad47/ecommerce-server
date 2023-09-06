const CustomError = require("./CustomError");
const { StatusCodes } = require("http-status-codes");
class internalServer extends CustomError {
  constructor(message, howToFix) {
    super(message, howToFix);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

module.exports = internalServer;
