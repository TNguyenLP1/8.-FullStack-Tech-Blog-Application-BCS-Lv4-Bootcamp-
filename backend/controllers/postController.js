import { post, user, category } from '../models/index.js';

export const getposts = async (req, res) => {
  try {
    const { category: categoryId } = req.query;
    const where = categoryId ? { categoryId } : {};
    const posts = await post.findAll({
      where,
      include: [
        { model: user, attributes: ['id', 'username'] },
        { model: category, attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

export const createpost = async (req, res) => {
  try {
    const { title, content, excerpt, categoryId } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content required' });

    const newPost = await post.create({
      title,
      content,
      excerpt,
      categoryId: categoryId || null,
      authorId: req.user.id
    });

    const withIncludes = await post.findByPk(newPost.id, {
      include: [
        { model: user, attributes: ['id', 'username'] },
        { model: category, attributes: ['id', 'name'] }
      ]
    });
    res.status(201).json(withIncludes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const updatepost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, categoryId } = req.body;
    const existingPost = await post.findByPk(id);
    if (!existingPost) return res.status(404).json({ error: 'Post not found' });
    if (existingPost.authorId !== req.user.id && req.user.role !== 'ADMIN')
      return res.status(403).json({ error: 'Unauthorized' });

    await existingPost.update({ title, content, excerpt, categoryId: categoryId || null });
    const withIncludes = await post.findByPk(existingPost.id, {
      include: [
        { model: user, attributes: ['id', 'username'] },
        { model: category, attributes: ['id', 'name'] }
      ]
    });
    res.json(withIncludes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update post' });
  }
};

export const deletepost = async (req, res) => {
  try {
    const { id } = req.params;
    const existingPost = await post.findByPk(id);
    if (!existingPost) return res.status(404).json({ error: 'Post not found' });
    if (existingPost.authorId !== req.user.id && req.user.role !== 'ADMIN')
      return res.status(403).json({ error: 'Unauthorized' });

    await existingPost.destroy();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete post' });
  }
};