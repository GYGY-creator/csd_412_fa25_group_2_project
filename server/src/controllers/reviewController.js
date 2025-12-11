const { validationResult, body, param } = require('express-validator');
const { Review, Restaurant, User } = require('../models');

const validateCreate = [
  body('title').isLength({ min: 1 }),
  body('body').isLength({ min: 1 }),
  body('rating').isInt({ min: 1, max: 5 }),
  body('restaurantId').isInt()
];
const validateId = [param('id').isInt()];

async function list(req, res, next) {
  try {
    const reviews = await Review.findAll({
      include: [{ model: User, attributes: ['id', 'username'] }, { model: Restaurant }],
      order: [['createdAt', 'DESC']]
    });
    res.json(reviews);
  } catch (err) { next(err); }
}

async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const review = await Review.create({ ...req.body, userId: req.user.id });
    res.status(201).json(review);
  } catch (err) { next(err); }
}

async function getById(req, res, next) {
  try {
    const review = await Review.findByPk(req.params.id, { include: [User, Restaurant] });
    if (!review) return res.status(404).json({ error: 'Not found' });
    res.json(review);
  } catch (err) { next(err); }
}

async function update(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: 'Not found' });
    if (review.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    await review.update(req.body);
    res.json(review);
  } catch (err) { next(err); }
}

async function remove(req, res, next) {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) return res.status(404).json({ error: 'Not found' });
    if (review.userId !== req.user.id && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    await review.destroy();
    res.status(204).send();
  } catch (err) { next(err); }
}

module.exports = { list, create, getById, update, remove, validateCreate, validateId };
