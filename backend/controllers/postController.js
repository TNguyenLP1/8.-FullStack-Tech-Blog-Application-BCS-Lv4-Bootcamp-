import { Post, User, Category } from '../models/index.js';

export const getPosts = async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { categoryId: category } : {};
    const posts = await Post.findAll({
      where,
      include: [User, Category],
      order: [['created_at', 'DESC']]
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, excerpt, categoryId } = req.body;
    const post = await Post.create({ title, content, excerpt, categoryId, authorId: req.user.id });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, categoryId } = req.body;
    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.authorId !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

    await post.update({ title, content, excerpt, categoryId });
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Unauthorized' });

    await post.destroy();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};
