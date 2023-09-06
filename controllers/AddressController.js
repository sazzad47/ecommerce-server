const { models } = require("../database/connect");
const { isHere } = require("../helpers/Validation");

const createAddress = async (req, res, next) => {
  const { address, city, postal_code, user_id } = req.body;
  const transactionObject = req.trans
    ? {
        transaction: req.trans,
      }
    : {};
  isHere(city, req.trans);
  isHere(address, req.trans);
  isHere(postal_code, req.trans);
  await models.address.create(
    {
      user_id: req.user_id || user_id,
      address,
      city,
      postal_code,
    },
    { ...transactionObject }
  );
  next();
};

// Update a user
const updateAddress = async (req, res, next) => {
  const { address_id } = req.params;
  await models.address.update(req.body, {
    where: {
      id: address_id,
    },
  });
  next();
};

module.exports = {
  createAddress,
  updateAddress,
};
