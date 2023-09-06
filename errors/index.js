const badRequest = require("./badRequest");
const unAuthanticated = require("./unAuthanticated");
const internalServer = require("./internalServer");
const notFound = require("./notFound");
module.exports = {
  badRequest,
  unAuthanticated,
  internalServer,
  notFound,
};
