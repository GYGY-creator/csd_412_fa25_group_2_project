const request = require('supertest')
const { app, initDb } = require('../../app')
const { sequelize } = require('../../models')

let token

beforeAll(async () => {
  await initDb()
})

beforeEach(async () => {
  await sequelize.sync({ force: true })
  await request(app).post('/api/v1/auth/register').send({ username: 'user1', email: 'u1@example.com', password: 'password123' })
  const login = await request(app).post('/api/v1/auth/login').send({ username: 'user1', password: 'password123' })
  token = login.body.token
})

afterAll(async () => {
  await sequelize.close()
})

describe('Restaurants extra cases', () => {
  test('unauthorized create (401)', async () => {
    const res = await request(app).post('/api/v1/restaurants').send({ name: 'R', address: 'A' })
    expect(res.status).toBe(401)
  })

  test('validation error on create (400)', async () => {
    const res = await request(app)
      .post('/api/v1/restaurants')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '', address: '' })
    expect(res.status).toBe(400)
  })

  test('invalid lat/lng (400)', async () => {
    const res = await request(app)
      .post('/api/v1/restaurants')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'X', address: 'Y', lat: 200, lng: 500 })
    expect(res.status).toBe(400)
  })

  test('get non-existent (404)', async () => {
    const res = await request(app).get('/api/v1/restaurants/9999')
    expect(res.status).toBe(404)
  })

  test('update and delete restaurant (200/204)', async () => {
    const created = await request(app)
      .post('/api/v1/restaurants')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Orig', address: 'Addr' })
      .expect(201)

    const updated = await request(app)
      .put(`/api/v1/restaurants/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'NewName', address: 'NewAddr' })
      .expect(200)
    expect(updated.body.name).toBe('NewName')

    await request(app)
      .delete(`/api/v1/restaurants/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const afterDelete = await request(app).get(`/api/v1/restaurants/${created.body.id}`)
    expect(afterDelete.status).toBe(404)
  })
})
