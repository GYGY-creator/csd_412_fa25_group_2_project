const bcrypt = require('bcrypt')
const { User, Restaurant, Review } = require('../models')

module.exports = async function seedDevData () {
  const existingRestaurants = await Restaurant.count()
  const existingUsers = await User.count()

  if (existingRestaurants > 0 || existingUsers > 0) {
    // Already seeded/has data; skip
    return
  }

  const passwordHash = await bcrypt.hash('password123', 10)

  const alice = await User.create({ username: 'alice', email: 'alice@example.com', passwordHash, role: 'user' })
  const bob = await User.create({ username: 'bob', email: 'bob@example.com', passwordHash, role: 'user' })

  const r1 = await Restaurant.create({ name: 'Demo Diner', address: '100 Sample Rd', lat: 37.7749, lng: -122.4194 })
  const r2 = await Restaurant.create({ name: 'Pasta Place', address: '123 Main St', lat: 40.7128, lng: -74.0060 })

  await Review.create({ title: 'Tasty!', body: 'Loved the ambiance and food.', rating: 5, userId: alice.id, restaurantId: r1.id })
  await Review.create({ title: 'Okay', body: 'Reasonable prices, average taste.', rating: 3, userId: bob.id, restaurantId: r2.id })

  // eslint-disable-next-line no-console
  console.log('Dev seed inserted sample users, restaurants, and reviews')
}
