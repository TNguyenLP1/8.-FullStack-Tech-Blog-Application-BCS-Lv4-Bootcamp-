import User from './User.js';
import Post from './Post.js';
import Category from './Category.js';

// User <> Post
User.hasMany(Post, { foreignKey: 'author_id' });
Post.belongsTo(User, { foreignKey: 'author_id' });

// Category <> Post
Category.hasMany(Post, { foreignKey: 'category_id' });
Post.belongsTo(Category, { foreignKey: 'category_id' });

export { User, Post, Category };
