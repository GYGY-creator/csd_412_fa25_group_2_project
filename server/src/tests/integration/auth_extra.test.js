const request = require('supertest')
const { app, initDb } = require('../../app')
const { sequelize } = require('../../models')

beforeAll(async () => {
  await initDb()
})

beforeEach(async () => {
  await sequelize.sync({ force: true })
})

afterAll(async () => {
  await sequelize.close()
})

describe('Auth extra cases', () => {
  test('register validation error (400) when payload missing', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({ username: 'bob' })
    expect(res.status).toBe(400)
    expect(res.body.errors).toBeDefined()
  })

  test('register duplicate username (409)', async () => {
    await request(app).post('/api/v1/auth/register').send({ username: 'dup', email: 'd@e.com', password: 'password123' }).expect(201)
    const res = await request(app).post('/api/v1/auth/register').send({ username: 'dup', email: 'x@y.com', password: 'password123' })
    expect(res.status).toBe(409)
  })

  test('login missing fields (400)', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ username: '' })
    expect(res.status).toBe(400)
  })

  test('login wrong password (401)', async () => {
    await request(app).post('/api/v1/auth/register').send({ username: 'eve', email: 'eve@example.com', password: 'password123' }).expect(201)
    const res = await request(app).post('/api/v1/auth/login').send({ username: 'eve', password: 'wrong' })
    expect(res.status).toBe(401)
  })
})
