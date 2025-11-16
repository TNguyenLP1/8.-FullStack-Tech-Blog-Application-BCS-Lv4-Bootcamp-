import User from './User.js';
import Post from './Post.js';
import Category from './Category.js';

User.hasMany(Post, { foreignKey: 'authorId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'authorId', onDelete: 'CASCADE' });

Category.hasMany(Post, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
Post.belongsTo(Category, { foreignKey: 'categoryId', onDelete: 'SET NULL' });

export { User, Post, Category };