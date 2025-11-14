import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Post = sequelize.define('Post', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  excerpt: { type: DataTypes.STRING },
  content: { type: DataTypes.TEXT, allowNull: false },
  authorId: { type: DataTypes.INTEGER, allowNull: false, field: 'author_id' },
  categoryId: { type: DataTypes.INTEGER, allowNull: true, field: 'category_id' }
}, {
  tableName: 'posts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

export default Post;
