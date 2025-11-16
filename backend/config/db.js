import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Use DATABASE_URL from environment (Render provides this for PostgreSQL)
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

try {
  await sequelize.authenticate();
  console.log('Connected to DB successfully');
} catch (err) {
  console.error('DB connection failed:', err);
}

export default sequelize;