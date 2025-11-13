const { Category } = require('../models');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    return res.json(categories);
  } catch (err) {
    console.error('Failed to fetch categories:', err);
    return res.status(500).json({ error: 'Server error fetching categories' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Missing name' });
    const existing = await Category.findOne({ where: { name } });
    if (existing) return res.status(400).json({ error: 'Category exists' });
    const cat = await Category.create({ name });
    return res.status(201).json(cat);
  } catch (err) {
    console.error('Create category error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
