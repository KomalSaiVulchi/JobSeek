require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const jobsRoutes = require('./routes/jobs');
const applicationsRoutes = require('./routes/applications');
const profileRoutes = require('./routes/profile');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/jobs', jobsRoutes);
app.use('/applications', applicationsRoutes);
app.use('/profile', profileRoutes);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // eslint-disable-next-line no-console
  console.error('MONGODB_URI is not set in environment');
} else {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('Connected to MongoDB');
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('MongoDB connection error:', err);
    });
}

module.exports = app;
