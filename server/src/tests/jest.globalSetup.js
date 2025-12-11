require('dotenv').config();
const { sequelize } = require('../models');

module.exports = async () => {
  // Ensure DB connection and run migrations before tests
  // We rely on migrations being run via sequelize-cli in CI or docker-compose.
  // For local runs, sync models as a fallback for developer convenience.
  try {
    await sequelize.authenticate();
    // no-op: migrations should have created tables
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Test DB connection failed', err);
    throw err;
  }
};
