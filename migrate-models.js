const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Set the path to your models directory
const modelsDirectory = path.join(__dirname, 'database/models');

// Get a list of model files in the directory
const modelFiles = fs.readdirSync(modelsDirectory);

// Iterate over the model files and generate migrations
modelFiles.forEach((modelFile) => {
  const modelName = path.basename(modelFile, '.js');
  const migrationName = `create-${modelName.toLowerCase()}-table`;

  // Use Sequelize CLI to generate a migration for the model
  execSync(`sequelize migration:generate --name ${migrationName}`);
});
