import bcrypt from 'bcryptjs';
import { user } from '../models/index.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: 'All fields required' });

    if (await user.findOne({ where: { email } }))
      return res.status(400).json({ error: 'Email already registered' });
    if (await user.findOne({ where: { username } }))
      return res.status(400).json({ error: 'Username already taken' });

    await user.create({ username, email, password });
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'All fields required' });

    const foundUser = await user.findOne({ where: { email } });
    if (!foundUser) return res.status(400).json({ error: 'Invalid email or password' });

    const match = await foundUser.comparePassword(password);
    if (!match) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: foundUser.id, username: foundUser.username, role: foundUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.json({ user: { id: foundUser.id, username: foundUser.username, role: foundUser.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};