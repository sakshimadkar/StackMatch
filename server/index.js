const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE'],
}));

app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const analyzeRoutes = require('./routes/analyze');

app.use('/api/auth', authRoutes);
app.use('/api/analyze', analyzeRoutes);

// MongoDB connect
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log(' MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(' Server running on port 5000')
    );
  })
  .catch(err => console.log(' MongoDB error:', err.message));