const express = require('express');
const authMiddleware = require('../middleware/auth');
const { validateRegister, validateLogin, register, login } = require('../controllers/authController');
const restaurantController = require('../controllers/restaurantController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth
router.post('/auth/register', validateRegister, register);
router.post('/auth/login', validateLogin, login);

// Restaurants
router.get('/restaurants', restaurantController.list);
router.post('/restaurants', authMiddleware(), restaurantController.validateCreate, restaurantController.create);
router.get('/restaurants/:id', restaurantController.validateId, restaurantController.getById);
router.put('/restaurants/:id', authMiddleware(), restaurantController.validateId, restaurantController.validateCreate, restaurantController.update);
router.delete('/restaurants/:id', authMiddleware(), restaurantController.validateId, restaurantController.remove);

// Reviews
router.get('/reviews', reviewController.list);
router.post('/reviews', authMiddleware(), reviewController.validateCreate, reviewController.create);
router.get('/reviews/:id', reviewController.validateId, reviewController.getById);
router.put('/reviews/:id', authMiddleware(), reviewController.validateId, reviewController.update);
router.delete('/reviews/:id', authMiddleware(), reviewController.validateId, reviewController.remove);

module.exports = router;
