const request = require('supertest');
const { app, initDb } = require('../../app');
const { sequelize, User } = require('../../models');

beforeAll(async () => {
  await initDb();
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth flows', () => {
  test('registers and logs in a user', async () => {
    const reg = await request(app)
      .post('/api/v1/auth/register')
      .send({ username: 'alice', email: 'alice@example.com', password: 'password123' })
      .expect(201);

    expect(reg.body).toHaveProperty('id');

    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: 'alice', password: 'password123' })
      .expect(200);

    expect(login.body).toHaveProperty('token');
  });
});
