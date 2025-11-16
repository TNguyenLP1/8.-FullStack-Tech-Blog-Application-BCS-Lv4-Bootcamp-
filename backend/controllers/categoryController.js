import { category } from '../models/index.js';

export const getCategories = async (req, res) => {
  try {
    const categories = await category.findAll({ order: [['name', 'ASC']] });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};