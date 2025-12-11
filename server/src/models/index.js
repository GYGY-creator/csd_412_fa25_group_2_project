const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const config = require('../config/config')[process.env.NODE_ENV || 'development'];

const sequelize = config.url
  ? new Sequelize(config.url, config)
  : new Sequelize(config.database, config.username, config.password, config);

const db = {};

const modelsPath = __dirname;
fs.readdirSync(modelsPath)
  .filter((file) => file !== 'index.js' && file.endsWith('.js'))
  .forEach((file) => {
    const model = require(path.join(modelsPath, file))(sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  ...db
};
