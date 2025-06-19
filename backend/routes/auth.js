const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { 
  register, 
  login, 
  getMe, 
  updateProfile,
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Register and login routes
router.post('/register', register);
router.post('/login', login);

// Debug route - REMOVE IN PRODUCTION
router.get('/debug/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      hasPassword: !!user.password,
      passwordLength: user.password?.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Password reset routes
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.put('/updateprofile', protect, updateProfile);

module.exports = router;
