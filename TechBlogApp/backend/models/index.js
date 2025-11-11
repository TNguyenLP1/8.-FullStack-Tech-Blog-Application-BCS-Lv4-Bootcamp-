const sequelize=require('../config/db');
const User=require('./user');
const Post=require('./post');
const Category=require('./category');
module.exports={sequelize,User,Post,Category};
