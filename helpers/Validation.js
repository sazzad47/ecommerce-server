const { badRequest } = require("../errors");

// Utility function to check if a key (data) is present; rollback a transaction if provided
const isHere = (key, trans) => {
  if (!key) {
    // If a transaction is provided, roll it back
    if (trans) {
      trans.rollback();
    }
    // Throw a badRequest error if the key is not present
    throw new badRequest("Provide data", ``);
  }
};

module.exports = {
  isHere,
};
