const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');
const Category = require('./category');

const Post = sequelize.define('Post',{
  id:{type:DataTypes.INTEGER,autoIncrement:true,primaryKey:true},
  title:{type:DataTypes.STRING,allowNull:false},
  excerpt:{type:DataTypes.STRING},
  content:{type:DataTypes.TEXT,allowNull:false}
},{tableName:'posts',timestamps:true});

User.hasMany(Post,{foreignKey:'authorId'});
Post.belongsTo(User,{foreignKey:'authorId'});
Category.hasMany(Post,{foreignKey:'categoryId'});
Post.belongsTo(Category,{foreignKey:'categoryId'});

module.exports=Post;
