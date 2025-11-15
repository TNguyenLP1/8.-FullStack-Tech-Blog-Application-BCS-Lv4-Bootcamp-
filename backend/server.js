import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/db.js';

import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';
import categoriesRoutes from './routes/categories.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Fix ES module path issue
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------
// MIDDLEWARE
// --------------------
app.use(cors({
  origin: 'http://localhost:3001', // adjust if frontend served from another port
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// --------------------
// API ROUTES
// --------------------
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/categories', categoriesRoutes);

// --------------------
// SERVE FRONTEND STATIC FILES
// --------------------
const frontendPath = path.join(__dirname, '../frontend/public');
app.use(express.static(frontendPath));

// --------------------
// CATCH-ALL ROUTE FOR SPA
// Exclude /api requests so JS modules load correctly
// --------------------
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// --------------------
// START SERVER
// --------------------
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB:', process.env.DB_NAME);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Database connection error:', err);
  }
}

start();
