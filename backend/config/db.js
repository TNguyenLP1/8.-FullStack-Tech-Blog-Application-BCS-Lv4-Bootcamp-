const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
  }
);

sequelize.authenticate()
  .then(() => console.log(`Loaded ENV: ${process.env.DB_USER} ${process.env.DB_PASS} ${process.env.DB_NAME}`))
  .catch(err => console.error('DB connection failed:', err));

module.exports = sequelize;
