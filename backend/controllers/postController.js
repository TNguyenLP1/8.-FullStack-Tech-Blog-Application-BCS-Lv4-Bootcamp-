const { Post, User, Category } = require('../models');

exports.getAllPosts = async (req, res) => {
  try {
    const { category } = req.query;
    const where = {};
    if (category) where.categoryId = category;

    const posts = await Post.findAll({
      where,
      include: [
        { model: User, as: 'User', attributes: ['id', 'username', 'role'] },
        { model: Category, as: 'Category', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });

    return res.json(posts);
  } catch (err) {
    console.error('Fetch posts error:', err);
    return res.status(500).json({ error: 'Failed to load posts' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content, excerpt, categoryId } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Missing fields' });

    const post = await Post.create({
      title,
      content,
      excerpt,
      categoryId: categoryId || null,
      authorId: req.user.id
    });

    return res.status(201).json({ message: 'Post created', post });
  } catch (err) {
    console.error('Create post error:', err);
    return res.status(500).json({ error: 'Failed to create post' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content, excerpt, categoryId } = req.body;
    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Unauthorized' });

    await post.update({ title, content, excerpt, categoryId: categoryId || null });
    return res.json({ message: 'Post updated', post });
  } catch (err) {
    console.error('Update post error:', err);
    return res.status(500).json({ error: 'Failed to update post' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Unauthorized' });

    await post.destroy();
    return res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error('Delete post error:', err);
    return res.status(500).json({ error: 'Failed to delete post' });
  }
};
