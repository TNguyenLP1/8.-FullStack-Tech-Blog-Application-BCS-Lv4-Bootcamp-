const sequelize = require('../config/db');
const User = require('./user');
const Post = require('./post');   // <-- fixed
const Category = require('./category'); // <-- include category if needed

// Define relationships (you already did some in Post.js, so this is optional)
User.hasMany(Post, { foreignKey: 'authorId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'authorId' });

Category.hasMany(Post, { foreignKey: 'categoryId' });
Post.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = { sequelize, User, Post, Category };  // <-- export Post, not Blog
