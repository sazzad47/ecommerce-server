const CustomError = require("./CustomError");
const { StatusCodes } = require("http-status-codes");
class unathanticated extends CustomError {
  constructor(message, howToFix) {
    super(message, howToFix);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

module.exports = unathanticated;
