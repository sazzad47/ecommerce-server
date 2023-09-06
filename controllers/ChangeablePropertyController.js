const { models } = require("../database/connect");
const { notFound } = require("../errors");
const { isHere } = require("../helpers/Validation");

// Get all changeable properties
const getAllChangeableProperties = async (req, res) => {
  const changeableProperties = await models.changeable_property.findAll();
  res.status(200).json(changeableProperties);
};

// Create a new changeable property
const createChangeableProperty = async (req, res) => {
  const { name, type, values } = req.body;
  isHere(name);
  isHere(type);
  const changeableProperty = await models.changeable_property.create({
    name,
    type,
  });
  values.forEach(async (value) => {
    await models.changable_property_value.create({
      changeable_property_id: changeableProperty.id,
      value,
    });
  });
  res.status(201).json(changeableProperty);
};

// Update a changeable property
const updateChangeableProperty = async (req, res) => {
  const { id } = req.params;
  const { name, type } = req.body;
  isHere(name);
  isHere(type);
  const [changeableProperty] = await models.changeable_property.update(
    {
      name,
      type,
    },
    {
      where: {
        id,
      },
    }
  );
  if (changeableProperty) {
    res.status(200).json(changeableProperty);
  } else {
    throw new notFound("No changeable property with this details", "");
  }
};

// Get a changeable property by ID
const getChangeableProperty = async (req, res) => {
  const { id } = req.params;
  const changeableProperty = await models.changeable_property.findByPk(id);
  if (changeableProperty) {
    res.status(200).json(changeableProperty);
  } else {
    throw new notFound("No changeable property with this ID", "");
  }
};

// Delete a changeable property
const deleteChangeableProperty = async (req, res) => {
  const { id } = req.params;
  await models.changeable_property.destroy({
    where: {
      id,
    },
  });
  res.status(200).json({ message: "Changeable property deleted successfully" });
};

// Get all changeable property values for a given changeable property
const getAllChangeablePropertyValues = async (req, res) => {
  const { id } = req.params;
  const changeableProperty = await models.changeable_property.findByPk(id);
  if (changeableProperty) {
    const changeablePropertyValues =
      await models.changable_property_value.findAll({
        where: {
          changeable_property_id: changeableProperty.id,
        },
      });
    res.status(200).json(changeablePropertyValues);
  } else {
    throw new notFound("No changeable property with this ID", "");
  }
};

// Create a new changeable property value for a given changeable property
const createChangeablePropertyValue = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  const changeableProperty = await models.changeable_property.findByPk(id);
  if (changeableProperty) {
    const changeablePropertyValue =
      await models.changable_property_value.create({
        changeable_property_id: changeableProperty.id,
        value,
      });
    res.status(201).json(changeablePropertyValue);
  } else {
    throw new notFound("No changeable property with this ID", "");
  }
};

// Delete a changeable property value
const deleteChangeablePropertyValue = async (req, res) => {
  const { id } = req.params;
  await models.changable_property_value.destroy({
    where: {
      id,
    },
  });
  res
    .status(200)
    .json({ message: "Changeable property value deleted successfully" });
};

module.exports = {
  createChangeableProperty,
  deleteChangeableProperty,
  getAllChangeableProperties,
  getChangeableProperty,
  createChangeablePropertyValue,
  deleteChangeablePropertyValue,
  getAllChangeablePropertyValues,
  updateChangeableProperty
};
