const { validationResult, body } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const validateRegister = [
  body('username').isLength({ min: 3 }),
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
];

const validateLogin = [
  body('username').notEmpty(),
  body('password').notEmpty()
];

async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, email, password } = req.body;

    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(409).json({ error: 'Username already taken' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash });

    res.status(201).json({ id: user.id, username: user.username, email: user.email });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await user.validatePassword(password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { sub: user.id, role: user.role },
      process.env.JWT_SECRET || 'devsecret',
      { expiresIn: '7d' }
    );

    res.json({ token });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, validateRegister, validateLogin };
