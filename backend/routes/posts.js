import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { post, user, category } from '../models/index.js';

const router = express.Router();

// Get posts (optional by category)
router.get('/', async (req, res) => {
  const category = req.query.category;
  const where = category ? { categoryId: category } : {};
  const posts = await post.findAll({
    where,
    include: [
      { model: user, attributes: ['id', 'username'] },
      { model: category, attributes: ['id', 'name'] }
    ],
    order: [['created_at', 'DESC']]
  });
  res.json(posts);
});

// Create post
router.post('/', authMiddleware, async (req, res) => {
  const { title, content, excerpt, categoryId } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

  const post = await post.create({
    title, content, excerpt,
    categoryId: categoryId || null,
    authorId: req.user.id
  });

  const withIncludes = await post.findByPk(post.id, {
    include: [
      { model: user, attributes: ['id', 'username'] },
      { model: category, attributes: ['id', 'name'] }
    ]
  });

  res.status(201).json(withIncludes);
});

// Update post
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, content, excerpt, categoryId } = req.body;
  const post = await Post.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

  await post.update({ title, content, excerpt, categoryId: categoryId || null });

  const withIncludes = await Post.findByPk(post.id, {
    include: [
      { model: user, attributes: ['id', 'username'] },
      { model: category, attributes: ['id', 'name'] }
    ]
  });

  res.json(withIncludes);
});

// Delete post
router.delete('/:id', authMiddleware, async (req, res) => {
  const post = await post.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });

  await post.destroy();
  res.json({ message: 'Post deleted' });
});

export default router;