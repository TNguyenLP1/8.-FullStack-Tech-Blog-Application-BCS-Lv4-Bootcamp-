import { sequelize } from '../models/index.js';
import { User, Category } from '../models/associations.js';

async function ensureDevSeed() {
  await sequelize.sync({ alter: true });
  const count = await Category.count();
  if (count === 0) {
    await Category.bulkCreate([
      { name: 'Tech' },
      { name: 'Programming' },
      { name: 'AI' },
      { name: 'DevOps' }
    ]);
    console.log('Seeded default categories');
  }
}

ensureDevSeed().catch(err => console.error('Seeding failed:', err));