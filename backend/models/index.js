// backend/models/index.js
const sequelize = require('../config/db');
const User = require('./user');
const Blog = require('./blog');

// Define relationships
User.hasMany(Blog, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Blog.belongsTo(User, { foreignKey: 'user_id' });

module.exports = { sequelize, User, Blog };