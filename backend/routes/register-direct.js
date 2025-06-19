const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Generate JWT Token - copied from authController
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Direct registration endpoint
router.post('/', async (req, res) => {
  try {
    console.log('Direct registration attempt for:', req.body.email);
    const { name, email, password, phone } = req.body;

    // Manual MongoDB operations
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Check if user exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user document
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone
    });
    
    // Save user to database
    await newUser.save();
    
    // Generate token
    const token = generateToken(newUser._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        avatar: newUser.avatar,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Direct registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error in direct registration',
      error: error.message
    });
  }
});

module.exports = router;
