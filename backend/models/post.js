const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Post = sequelize.define('Post', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  excerpt: { type: DataTypes.STRING },
  content: { type: DataTypes.TEXT, allowNull: false },
  authorId: { type: DataTypes.INTEGER, allowNull: false, field: 'author_id' },
  categoryId: { type: DataTypes.INTEGER, allowNull: true, field: 'category_id' },
}, { tableName: 'posts', timestamps: true });

module.exports = Post;
