// Import required dependencies
require("dotenv").config(); // Load environment variables from '.env' file
require("express-async-errors"); // Handle async errors in Express
const express = require("express");
const app = express();
const cors = require("cors"); // Enable Cross-Origin Resource Sharing (CORS)
const port = process.env.PORT || 5000; // Get the port from environment variables or use 5000 as default

const sequelize = require("../database/connect"); // Sequelize database connection
const bodyParser = require("body-parser"); // Parse request bodies

// Import middleware and routers
const errorHandlerMiddleware = require("../middlewares/errorHandler");
const notFound = require("../middlewares/notFound");
const categoryRouter = require("../routes/Category");
const productRouter = require("../routes/Product");
const PropertyRouter = require("../routes/Property");
const ChangealbePropertyRouter = require("../routes/ChangeableProperty");
const UsersRouter = require("../routes/User");
const CartRouter = require("../routes/Cart");
const connectRouter = require("../routes/Connect");
const orderRouter = require("../routes/Order");
const dashboardRouter = require("../routes/Dashboard");
const adminRouter = require("../routes/Admin");
const InitialRouter = require("../routes/Initial");
const RecommendationRouter = require("../routes/Recommendation");

app.use(express.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.use(cors()); // Enable CORS

// Mount routers to specific paths
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/property", PropertyRouter);
app.use("/changeableproperty", ChangealbePropertyRouter);
app.use("/users", UsersRouter);
app.use("/cart", CartRouter);
app.use("/connect", connectRouter);
app.use("/order", orderRouter);
app.use("/dash", dashboardRouter);
app.use("/admin", adminRouter);
app.use("/home", InitialRouter);
app.use("/recommend", RecommendationRouter);

// Use the notFound middleware for handling undefined routes
app.use(notFound);

// Use the errorHandlerMiddleware for handling errors
app.use(errorHandlerMiddleware);

// Define database models and relationships
const defineModels = () => {
  const modelDefiners = [
    require("../database/models/category"),
    require("../database/models/product"),
    require("../database/models/product_images"),
    require("../database/models/property"),
    require("../database/models/property_values"),
    require("../database/models/category_property"),
    require("../database/models/product_properties"),
    require("../database/models/changeable_property"),
    require("../database/models/changble_property_values"),
    require("../database/models/user"),
    require("../database/models/cart"),
    require("../database/models/cartItems"),
    require("../database/models/users_cart"),
    require("../database/models/adress"),
    require("../database/models/order"),
    require("../database/models/Order_items"),
    require("../database/models/admins"),
    require("../database/models/slider_images"),
    require("../database/models/site_pages"),
    require("../database/models/recommendations"),
  ];

  for (const modelDefiner of modelDefiners) {
    modelDefiner();
  }
  sequelize.models.property.hasMany(sequelize.models.PropertyValue, {
    foreignKey: "property_id",
    as: "values",
  });
  sequelize.models.categoriesProperties.belongsTo(sequelize.models.property, {
    foreignKey: "property_id",
  });
  sequelize.models.user.hasMany(sequelize.models.order, {
    foreignKey: "user_id",
    as: "customer",
  });
  sequelize.models.order.hasMany(sequelize.models.order_item, {
    foreignKey: "order_id",
  });

  sequelize.models.order.belongsTo(sequelize.models.user, {
    foreignKey: "user_id",
  });

  sequelize.models.order.belongsTo(sequelize.models.address, {
    foreignKey: "address_id",
  });

  sequelize.models.product.hasMany(sequelize.models.productImages, {
    foreignKey: "product_id",
    as: "images",
  });

  sequelize.models.order_item.belongsTo(sequelize.models.product, {
    foreignKey: "product_id",
    as: "product",
  });
};

console.log('sequelize.models', sequelize.models)

async function assertDatabaseConnectionOk() {
  console.log(`Checking database connection...`);
  try {
    await sequelize.authenticate(); // Test the database connection
    console.log("Sequelize has established DB connection successfully.");
    defineModels(); // Define Sequelize models and relationships
    console.log(`Models defined`);
    console.log('sequelize.models', sequelize.models.admins);
    console.log(`Database connection OK!`);
  } catch (error) {
    console.log("Unable to connect to the database:");
    console.log(error);
    process.exit(1); // Exit the process with an error code
  }
}

const fireServer = async () => {
  try {
    await assertDatabaseConnectionOk(); // Ensure the database connection is OK
    app.listen(port, () => {
      console.log(`Server is fired succefully on port ${port}`);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Start the server
fireServer();
