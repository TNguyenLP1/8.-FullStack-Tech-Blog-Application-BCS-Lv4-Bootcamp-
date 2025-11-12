const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();

// -------------------------
// CORS
// -------------------------
// Allow frontend (live-server) to communicate with backend
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Parse JSON requests
app.use(express.json());

// -------------------------
// Routes
// -------------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/categories', require('./routes/categories'));

// -------------------------
// Start server
// -------------------------
const PORT = process.env.PORT || 3001;
sequelize.sync({ alter: true }) // ensure DB tables match models
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => console.error('Failed to sync database:', err));
