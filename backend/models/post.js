import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Category from './Category.js';

const Post = sequelize.define('Post', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(255), allowNull: false },
  excerpt: { type: DataTypes.STRING(255) },
  content: { type: DataTypes.TEXT, allowNull: false },
  authorId: { type: DataTypes.INTEGER, allowNull: true },
  categoryId: { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'posts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

Post.belongsTo(User, { foreignKey: 'authorId', onDelete: 'CASCADE' });
Post.belongsTo(Category, { foreignKey: 'categoryId', onDelete: 'SET NULL' });

export default Post;