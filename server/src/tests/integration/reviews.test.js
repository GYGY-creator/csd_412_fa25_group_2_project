const request = require('supertest');
const { app, initDb } = require('../../app');
const { sequelize } = require('../../models');

let token;
let restaurantId;

beforeAll(async () => {
  await initDb();
  await sequelize.sync({ force: true });

  await request(app)
    .post('/api/v1/auth/register')
    .send({ username: 'chris', email: 'chris@example.com', password: 'password123' })
    .expect(201);

  const login = await request(app)
    .post('/api/v1/auth/login')
    .send({ username: 'chris', password: 'password123' })
    .expect(200);
  token = login.body.token;

  const restaurant = await request(app)
    .post('/api/v1/restaurants')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Sushi Spot', address: '456 Ocean Ave' })
    .expect(201);
  restaurantId = restaurant.body.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Reviews CRUD', () => {
  test('create, list, update, delete review', async () => {
    const created = await request(app)
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Great!', body: 'Loved the sushi', rating: 5, restaurantId })
      .expect(201);

    const list = await request(app).get('/api/v1/reviews').expect(200);
    expect(list.body.length).toBeGreaterThanOrEqual(1);

    const updated = await request(app)
      .put(`/api/v1/reviews/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Loved the sushi and ambience' })
      .expect(200);
    expect(updated.body.body).toMatch(/ambience/);

    await request(app)
      .delete(`/api/v1/reviews/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
  });
});
