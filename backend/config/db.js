import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

try {
  await sequelize.authenticate();
  console.log(`Connected to DB: ${process.env.DB_NAME}`);
} catch (err) {
  console.error('DB connection failed:', err);
}

export default sequelize;
