const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');
require('dotenv').config();

const app = express();

// -------------------------
// Middleware
// -------------------------
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// -------------------------
// API Routes
// -------------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/categories', require('./routes/categories'));

// -------------------------
// Serve Frontend in Production
// -------------------------
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend');
  app.use(express.static(frontendPath));
  app.get('*', (_, res) => res.sendFile(path.join(frontendPath, 'index.html')));
}

// -------------------------
// Start Server
// -------------------------
const PORT = process.env.PORT || 3001;
sequelize
  .sync({ force: true }) // force drop & recreate tables
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('Failed to sync database:', err));
