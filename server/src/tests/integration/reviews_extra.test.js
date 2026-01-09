const request = require('supertest')
const { app, initDb } = require('../../app')
const { sequelize } = require('../../models')

let user1Token
let user2Token
let restaurantId

beforeAll(async () => {
  await initDb()
})

beforeEach(async () => {
  await sequelize.sync({ force: true })
  await request(app).post('/api/v1/auth/register').send({ username: 'userone', email: 'u1@example.com', password: 'password123' })
  await request(app).post('/api/v1/auth/register').send({ username: 'usertwo', email: 'u2@example.com', password: 'password123' })
  const login1 = await request(app).post('/api/v1/auth/login').send({ username: 'userone', password: 'password123' })
  const login2 = await request(app).post('/api/v1/auth/login').send({ username: 'usertwo', password: 'password123' })
  user1Token = login1.body.token
  user2Token = login2.body.token

  const restaurant = await request(app)
    .post('/api/v1/restaurants')
    .set('Authorization', `Bearer ${user1Token}`)
    .send({ name: 'R1', address: 'A1' })
  restaurantId = restaurant.body.id
})

afterAll(async () => {
  await sequelize.close()
})

describe('Reviews extra cases', () => {
  test('unauthorized create (401)', async () => {
    const res = await request(app)
      .post('/api/v1/reviews')
      .send({ title: 'T', body: 'B', rating: 5, restaurantId })
    expect(res.status).toBe(401)
  })

  test('validation error on create (400)', async () => {
    const res = await request(app)
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ title: '', body: '', rating: 10, restaurantId: 'abc' })
    expect(res.status).toBe(400)
  })

  test('update + delete forbidden for non-owner (403)', async () => {
    const created = await request(app)
      .post('/api/v1/reviews')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ title: 'ok', body: 'ok', rating: 4, restaurantId })
      .expect(201)

    const upd = await request(app)
      .put(`/api/v1/reviews/${created.body.id}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ body: 'hacked' })
    expect(upd.status).toBe(403)

    const del = await request(app)
      .delete(`/api/v1/reviews/${created.body.id}`)
      .set('Authorization', `Bearer ${user2Token}`)
    expect(del.status).toBe(403)
  })

  test('get non-existent (404) and update non-existent (404)', async () => {
    const g = await request(app).get('/api/v1/reviews/9999')
    expect(g.status).toBe(404)

    const u = await request(app)
      .put('/api/v1/reviews/9999')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ body: 'none' })
    expect(u.status).toBe(404)
  })
})
