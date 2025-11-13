const sequelize = require('../config/db');

const User = require('./user');
const Post = require('./post');
const Category = require('./category');

// Associations
User.hasMany(Post, { foreignKey: 'authorId', sourceKey: 'id' });
Post.belongsTo(User, { foreignKey: 'authorId', as: 'User' });

Category.hasMany(Post, { foreignKey: 'categoryId', sourceKey: 'id' });
Post.belongsTo(Category, { foreignKey: 'categoryId', as: 'Category' });

module.exports = {
  sequelize,
  User,
  Post,
  Category
};
