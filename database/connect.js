const { Sequelize } = require("sequelize");

const host = process.env.RDS_HOST;
const port = 7362; // Database current port
const database = "railway";
const username = process.env.RDS_USER;
const password = process.env.RDS_PASSWORD;
const dialect = "postgres";
const { timeZone } = Intl.DateTimeFormat().resolvedOptions(); // System time zone

const sequelize = new Sequelize(database, username, password, {
  dialect: dialect,
  freezeTableName: true, // Use the model name as the table name (no pluralization)
  underscored: true, // Use underscores in column names (snake_case)
  schema: "ecommerce", // Set the schema for the tables
  host: host,
  port: port,
  omitNull: true, // Omit null values from INSERT and UPDATE queries
  autoIncrement: true, // Enable auto-increment for primary keys
  // logging: false, // Disable logging SQL queries to the console
  logging: console.log, // Log SQL queries to the console
  dialectOptions: {
    prependSearchPath: true, // Prepend the schema name in queries
  },
  timezone: timeZone,
  pool: { max: 5, idle: 0, min: 0, acquire: 3000 }, // Connection pool configuration
});

module.exports = sequelize;
