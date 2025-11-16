import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const post = sequelize.define('post', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  excerpt: { type: DataTypes.STRING(255) },
  content: { type: DataTypes.TEXT, allowNull: false },
  authorId: { type: DataTypes.INTEGER },
  categoryId: { type: DataTypes.INTEGER }
}, {
  tableName: 'posts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default post;