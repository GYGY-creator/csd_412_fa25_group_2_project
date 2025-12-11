const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');
const { sequelize } = require('./models');

const app = express();

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100 });
app.use(limiter);

app.use('/api/v1', routes);
app.use(errorHandler);

async function initDb() {
  try {
    await sequelize.authenticate();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to connect to DB', err);
    process.exit(1);
  }
}

module.exports = { app, initDb };
