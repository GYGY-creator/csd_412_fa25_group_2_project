require('dotenv').config();
const { app, initDb } = require('./app');

const PORT = process.env.PORT || 3000;

initDb().then(() => {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`SoundReviews API listening on port ${PORT}`);
  });
});
