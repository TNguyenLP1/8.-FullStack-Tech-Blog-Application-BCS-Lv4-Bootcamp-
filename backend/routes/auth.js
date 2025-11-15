import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

export default router;
