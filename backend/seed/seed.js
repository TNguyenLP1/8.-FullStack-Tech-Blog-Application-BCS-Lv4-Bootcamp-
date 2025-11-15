import { sequelize } from '../models/index.js';
import { User, Category, Post } from '../models/associations.js';

async function seed() {
  try {
    // Make sure tables exist
    await sequelize.sync({ force: true }); // Drops and recreates tables
    console.log('Database synced!');

    // Create admin user
    await User.create({
      username: 'admin',
      email: 'admin@test.com',
      password: 'admin123', // hashed automatically by hook
      role: 'ADMIN'
    });

    // Create categories
    await Category.bulkCreate([
      { name: 'Tech' },
      { name: 'Programming' },
      { name: 'AI' },
      { name: 'DevOps' }
    ]);

    console.log('Seeding completed!');
    process.exit(0); // Exit script
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
