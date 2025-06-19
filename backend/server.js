const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const rentalRoutes = require('./routes/rentals');
const paymentRoutes = require('./routes/payments');
const uploadRoutes = require('./routes/uploads');
const registerDirectRoute = require('./routes/register-direct');


// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/register-direct', registerDirectRoute);

// Root route
app.get('/', (req, res) => {
  res.send('RYT API is running...');
});

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ryt-db';
mongoose
  .connect(MONGO_URI, {
    serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
    socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Set port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
