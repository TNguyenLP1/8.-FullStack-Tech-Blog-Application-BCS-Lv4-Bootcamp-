// Import default exports from each model file
import user from './user.js';
import post from './post.js';
import category from './category.js';

// Define associations
user.hasMany(post, { foreignKey: 'authorId', onDelete: 'CASCADE' });
post.belongsTo(user, { foreignKey: 'authorId', onDelete: 'CASCADE' });

category.hasMany(post, { foreignKey: 'categoryId', onDelete: 'SET NULL' });
post.belongsTo(category, { foreignKey: 'categoryId', onDelete: 'SET NULL' });

// Export the models so other parts of the app can use them
export { user, post, category };