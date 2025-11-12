const { Sequelize } = require('sequelize');
const sequelize = require('../config/db');

// Import models
const User = require('./user');
const Post = require('./post');
const Category = require('./category');

// Define associations
User.hasMany(Post, { foreignKey: 'authorId' });
Post.belongsTo(User, { foreignKey: 'authorId' });

Category.hasMany(Post, { foreignKey: 'categoryId' });
Post.belongsTo(Category, { foreignKey: 'categoryId' });

module.exports = { sequelize, User, Post, Category };
