require('dotenv').config();
console.log('Loaded ENV:', process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME); // 👈 debug line

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'tech_blog_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('Database connection error:', err));

module.exports = sequelize;