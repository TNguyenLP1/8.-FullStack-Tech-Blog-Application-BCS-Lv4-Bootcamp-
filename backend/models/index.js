import sequelize from '../config/db.js';
import { user, post, category } from './associations.js';

// Initialize and sync schema
async function initSchema() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');

    // Sync models with DB schema
    await sequelize.sync({ alter: true }); 
    console.log('Database schema synchronized');
  } catch (err) {
    console.error('Error creating database tables:', err);
  }
}

// Run schema initialization
initSchema();

// Export sequelize instance and models
export {
  sequelize,
  user,
  post,
  category
};