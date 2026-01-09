const request = require('supertest')
const { app, initDb } = require('../../app')
const { sequelize, Restaurant } = require('../../models')

beforeAll(async () => {
  await initDb()
})

beforeEach(async () => {
  await sequelize.sync({ force: true })
})

afterAll(async () => {
  await sequelize.close()
})

describe('Global error handler', () => {
  test('returns 500 on internal errors', async () => {
    const spy = jest.spyOn(Restaurant, 'findAll').mockRejectedValue(new Error('boom'))

    const res = await request(app).get('/api/v1/restaurants')
    expect(res.status).toBe(500)
    expect(res.body.error).toBe('boom')

    spy.mockRestore()
  })
})
