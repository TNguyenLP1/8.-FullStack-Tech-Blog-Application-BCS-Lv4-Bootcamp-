import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import User from './User.js';
import Category from './Category.js';

const Post = sequelize.define('Post', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  excerpt: DataTypes.STRING,
  content: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'posts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Foreign keys
Post.belongsTo(User, { foreignKey: 'author_id', onDelete: 'CASCADE' });
Post.belongsTo(Category, { foreignKey: 'category_id', onDelete: 'SET NULL' });

export default Post;
