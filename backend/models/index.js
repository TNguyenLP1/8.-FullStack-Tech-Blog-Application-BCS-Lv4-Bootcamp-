import sequelize from '../config/db.js';
import { User, Post, Category } from './associations.js';

// Auto-create tables if they don't exist
sequelize.sync({ force: true }) // force: true drops tables if they exist
  .then(() => {
    console.log('Database & tables created successfully!');
  })
  .catch(err => console.error('Error creating database tables:', err));

export { sequelize, User, Post, Category };
