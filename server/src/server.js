require('dotenv').config();
const { app, initDb } = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

initDb().then(async () => {
  // Optional dev-only sync and seeding
  if (process.env.NODE_ENV === 'development' && process.env.AUTO_SYNC_ON_DEV === '1') {
    await sequelize.sync();
  }
  if (process.env.NODE_ENV === 'development' && process.env.SEED_ON_START === '1') {
    const seedDev = require('./utils/devSeed');
    try {
      await seedDev();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Dev seed failed', e);
    }
  }

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`SoundReviews API listening on port ${PORT}`);
  });
});
