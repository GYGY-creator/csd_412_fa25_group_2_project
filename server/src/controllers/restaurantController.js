const { validationResult, body, param } = require('express-validator');
const { Restaurant, Review, User } = require('../models');

const validateCreate = [
  body('name').isLength({ min: 1 }),
  body('address').isLength({ min: 1 }),
  body('lat').optional().isFloat({ min: -90, max: 90 }),
  body('lng').optional().isFloat({ min: -180, max: 180 })
];

const validateId = [param('id').isInt()];

async function list(req, res, next) {
  try {
    const restaurants = await Restaurant.findAll({
      order: [['id', 'DESC']],
      include: [{ model: Review, limit: 3, order: [['createdAt', 'DESC']] }]
    });
    res.json(restaurants);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const restaurant = await Restaurant.create(req.body);
    res.status(201).json(restaurant);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id, {
      include: [{ model: Review, include: [{ model: User, attributes: ['id', 'username'] }] }]
    });
    if (!restaurant) return res.status(404).json({ error: 'Not found' });
    res.json(restaurant);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Not found' });
    await restaurant.update(req.body);
    res.json(restaurant);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const restaurant = await Restaurant.findByPk(req.params.id);
    if (!restaurant) return res.status(404).json({ error: 'Not found' });
    await restaurant.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { list, create, getById, update, remove, validateCreate, validateId };
