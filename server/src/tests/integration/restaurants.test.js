const request = require('supertest');
const { app, initDb } = require('../../app');
const { sequelize } = require('../../models');

let token;

beforeAll(async () => {
  await initDb();
  await sequelize.sync({ force: true });

  await request(app)
    .post('/api/v1/auth/register')
    .send({ username: 'bob', email: 'bob@example.com', password: 'password123' })
    .expect(201);

  const login = await request(app)
    .post('/api/v1/auth/login')
    .send({ username: 'bob', password: 'password123' })
    .expect(200);
  token = login.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Restaurants CRUD', () => {
  test('create and list restaurants', async () => {
    const created = await request(app)
      .post('/api/v1/restaurants')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Pasta Place', address: '123 Main St', lat: 40.7128, lng: -74.0060 })
      .expect(201);

    const list = await request(app).get('/api/v1/restaurants').expect(200);
    expect(Array.isArray(list.body)).toBe(true);
    expect(list.body[0].name).toBe('Pasta Place');

    const fetched = await request(app).get(`/api/v1/restaurants/${created.body.id}`).expect(200);
    expect(fetched.body.name).toBe('Pasta Place');
  });
});
