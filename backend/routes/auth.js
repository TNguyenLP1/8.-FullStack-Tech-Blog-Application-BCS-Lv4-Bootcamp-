import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

// -------------------------
// REGISTER
// -------------------------
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ message: 'All fields required' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    res.json({ message: 'User registered successfully', user: { id: user.id, username: user.username } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------
// LOGIN
// -------------------------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });

  // Sign JWT
  const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

  // Set cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  });

  res.json({ message: 'Login successful', user: { id: user.id, username: user.username, role: user.role } });
});

// -------------------------
// LOGOUT
// -------------------------
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// -------------------------
// GET CURRENT USER
// -------------------------
router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: ['id', 'username', 'role', 'email'] });
  res.json({ user });
});

export default router;
