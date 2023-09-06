class CustomError extends Error {
  constructor(message, howToFix) {
    super(message);
    this.howToFix = howToFix;
  }
}

module.exports = CustomError;
