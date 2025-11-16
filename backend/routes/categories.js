import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getCategories } from '../controllers/categoryController.js';
import { category } from '../models/index.js';

const router = express.Router();

// Get all categories
router.get('/', getCategories);

// Create new category
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name required' });

    const existing = await category.findOne({ where: { name } });
    if (existing) return res.status(400).json({ error: 'Category already exists' });

    const cat = await category.create({ name });
    res.status(201).json(cat);
  } catch (err) {
    console.error('POST /categories error:', err); // ✅ log actual error
    res.status(500).json({ error: 'Failed to create category' });
  }
});

export default router;