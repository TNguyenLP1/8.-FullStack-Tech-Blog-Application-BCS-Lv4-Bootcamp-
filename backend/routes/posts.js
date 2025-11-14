import express from 'express';
import { Post, Category, User } from '../models/index.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// -------------------------
// GET ALL POSTS
// -------------------------
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: User, attributes: ['id', 'username'] },
        { model: Category, attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------
// GET POST BY ID
// -------------------------
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'username'] },
        { model: Category, attributes: ['id', 'name'] }
      ]
    });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------
// CREATE POST (protected)
// -------------------------
router.post('/', authMiddleware, async (req, res) => {
  const { title, excerpt, content, categoryId } = req.body;
  if (!title || !content) return res.status(400).json({ message: 'Title and content required' });

  try {
    const post = await Post.create({
      title,
      excerpt,
      content,
      CategoryId: categoryId || null,
      UserId: req.user.id
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------
// UPDATE POST (protected)
// -------------------------
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, excerpt, content, categoryId } = req.body;
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    // Only author or ADMIN can edit
    if (post.UserId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await post.update({ title, excerpt, content, CategoryId: categoryId });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// -------------------------
// DELETE POST (protected)
// -------------------------
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Only author or ADMIN can delete
    if (post.UserId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await post.destroy();
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
