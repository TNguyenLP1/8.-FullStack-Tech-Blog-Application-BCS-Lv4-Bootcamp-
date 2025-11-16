import sequelize from '../config/db.js';
import { User, Post, Category } from './associations.js';

async function initSchema() {
  await sequelize.sync({ alter: true });
  console.log('Database schema synchronized');
}

initSchema().catch(err => console.error('Error creating database tables:', err));

export { sequelize, User, Post, Category };