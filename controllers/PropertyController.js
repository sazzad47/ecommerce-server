const { models } = require("../database/connect");
const { notFound } = require("../errors");
const { isHere } = require("../helpers/Validation");

// Get all properties
const getAllProperties = async (req, res) => {
  const properties = await models.property.findAll({
    include: [
      {
        model: models.PropertyValue,
        attributes: ["value", "id"],
        as: "values",
      },
    ],
  });
  res.status(200).json(properties);
};

// Create a new property
const createProperty = async (req, res) => {
  const { name, values, type } = req.body;
  isHere(name);
  isHere(values);
  const property = await models.property.create({ name, type });
  values.forEach(async (value) => {
    await models.PropertyValue.create({
      property_id: property.id,
      value,
    });
  });
  res.status(201).json(property);
};

// Update a property
const updateProperty = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const [property] = await models.property.update(
    {
      name,
    },
    {
      where: {
        id,
      },
    }
  );
  if (property) {
    res.status(200).json(property);
  } else {
    throw new notFound("No property with this details", "");
  }
};

const getProperty = async (req, res) => {
  const { id } = req.params;
  const property = await models.property.findByPk(id);
  const property_values = await models.PropertyValue.findAll({
    where: {
      property_id: property.id,
    },
  });
  res.status(200).json({ property, property_values });
};

// Get all  property values for a given changeable property
const getAllPropertyValues = async (req, res) => {
  const { id } = req.params;
  const Property = await models.property.findByPk(id);
  if (Property) {
    const PropertyValues = await models.PropertyValue.findAll({
      where: {
        property_id: Property.id,
      },
    });
    res.status(200).json(PropertyValues);
  } else {
    throw new notFound("No property with this ID", "");
  }
};

// Delete a property
const deleteProperty = async (req, res) => {
  const { id } = req.params;
  await models.property.destroy({
    where: {
      id,
    },
  });
  res.status(200).json({ message: "Property deleted successfully" });
};

const deleteValue = async (req, res) => {
  const { id } = req.params;
  await models.PropertyValue.destroy({
    where: {
      id,
    },
  });
  res.status(200).json({ message: "deleted successfully" });
};

const UpdateValue = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;
  await models.PropertyValue.update(
    {
      value,
    },
    {
      where: {
        id: id,
      },
    }
  );
  res.status(200).json({ message: "updated successfully" });
};

const addValuesToProperty = async (req, res) => {
  const { id } = req.params; // id here is the id of the property not the value
  const { values } = req.body;
  isHere(values);

  values.forEach(async (value) => {
    await models.PropertyValue.create({
      property_id: id,
      value,
    });
  });
  res.status(200).json({ message: "added successfully" });
};

module.exports = {
  getAllProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getProperty,
  deleteValue,
  UpdateValue,
  getAllPropertyValues,
  addValuesToProperty,
};
