const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const trendingRoutes = require('./routes/trending');
const newsRoutes = require('./routes/news');
const modsRoutes = require('./routes/mods');
const bugsRoutes = require('./routes/bugs');
const hytaleRoutes = require('./routes/hytale');
const achievementsRoutes = require('./routes/achievements');
const guidesRoutes = require('./routes/guides')


const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

app.get('/api/health', (req, res) => {
  const mongoose = require('mongoose');
  res.json({ 
    status: 'Ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Routes
app.use('/api/trending', trendingRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/mods', modsRoutes);
app.use('/api/bugs', bugsRoutes);
app.use('/api/guides', guidesRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/api/hytale', hytaleRoutes);
app.use('/api/achievements', achievementsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

module.exports = app;