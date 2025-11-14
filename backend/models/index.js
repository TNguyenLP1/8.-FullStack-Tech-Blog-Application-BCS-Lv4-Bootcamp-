import sequelize from '../config/db.js';
import User from './user.js';
import Post from './post.js';
import Category from './category.js';

// Associations
User.hasMany(Post, { foreignKey: 'authorId' });
Post.belongsTo(User, { foreignKey: 'authorId' });

Category.hasMany(Post, { foreignKey: 'categoryId' });
Post.belongsTo(Category, { foreignKey: 'categoryId' });

export { sequelize, User, Post, Category };
