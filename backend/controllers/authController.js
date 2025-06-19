const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Create a module exports object
const authController = {};

// Configure bcrypt settings
const SALT_ROUNDS = 10;

// Send email utility function
const sendEmail = async (options) => {
  // TODO: Implement email sending functionality
  console.log('Email would be sent with:', options);
};

// Generate JWT Token
const generateToken = (id) => {
  console.log('Generating token for user ID:', id);
  console.log('Using JWT_SECRET:', process.env.JWT_SECRET ? 'exists' : 'missing');
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
  console.log('Token generated successfully');
  return token;
};

// @desc    Register a user
// @route   POST /api/auth/register
// @access  Public
authController.register = async (req, res) => {
  try {
    console.log('Registration attempt for:', req.body.email);
    let { name, email, password, phone } = req.body;
    
    // Sanitize inputs
    password = password.trim();
    email = email.trim().toLowerCase();
    console.log('\n=== Registration Sanitized Inputs ===');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    console.log('Password buffer:', Buffer.from(password).toString('hex'));

    // Check if user already exists with timeout handling
    let userExists;
    try {
      userExists = await Promise.race([
        User.findOne({ email }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database query timeout')), 15000)
        )
      ]);
    } catch (error) {
      console.error('Error checking existing user:', error.message);
      // If we get a timeout, assume user doesn't exist and continue
      userExists = null;
    }
    
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create user with timeout handling
    let user;
    try {
      console.log('\n=== Registration Process ===');
      console.log('Raw password:', password);
      console.log('Password length:', password.length);
      
      // Create user and let the model handle password hashing
      // Hash password before creating user
      console.log('Hashing password with bcrypt...');
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      console.log('Generated hash:', hashedPassword);
      
      user = await Promise.race([
        User.create({
          name,
          email,
          password: hashedPassword, // Store the hashed password
          phone
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('User creation timeout')), 15000)
        )
      ]);
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }

    // Generate token and send response
    console.log('Registration successful, generating token...');
    const token = generateToken(user._id);
    console.log('Token generated, sending response...');

    const responseData = {
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    };
    console.log('Sending registration response:', { ...responseData, token: 'hidden' });
    res.status(201).json(responseData);
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
// Helper function to check stored user data
const verifyStoredUser = async (email) => {
  const user = await User.findOne({ email }).select('+password');
  if (user) {
    console.log('Stored user data:', {
      id: user._id,
      email: user.email,
      passwordLength: user.password?.length,
      hasPassword: !!user.password
    });
  }
  return false;
};

authController.login = async (req, res) => {
  try {
    console.log('\n=== Login Attempt ===');
    console.log('Email:', req.body.email);
    
    let { email, password } = req.body;
    
    // Sanitize inputs
    password = password.trim();
    email = email.trim().toLowerCase();
    console.log('\n=== Login Sanitized Inputs ===');
    console.log('Email:', email);
    console.log('Password length:', password.length);
    console.log('Password buffer:', Buffer.from(password).toString('hex'));

    // Input validation
    if (!email || !password) {
      console.log('Missing credentials');
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');
    console.log('\n=== Login Process ===');
    console.log('User lookup result:', user ? 'Found' : 'Not found');
    if (user) {
      console.log('Found user details:', {
        email: user.email,
        passwordLength: user.password ? user.password.length : 'no password',
        hasPassword: !!user.password,
        storedPassword: user.password // Log the actual stored password hash
      });
      console.log('Attempting login with:', {
        providedPassword: password,
        providedLength: password.length
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Verify password using the model method
    console.log('Attempting password verification...');
    console.log('Login attempt with password length:', password.length);
    const isMatch = await user.matchPassword(password);
    console.log('Password verification result:', isMatch);

    if (!isMatch) {
      console.log('Password mismatch, sending error response...');
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    console.log('Login successful, generating token...');
    const token = generateToken(user._id);
    console.log('Token generated, sending response...');

    const responseData = {
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    };
    console.log('Sending login response:', { ...responseData, token: 'hidden' });
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
authController.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
authController.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, address } = req.body;

    // Find user and update
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
authController.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetpassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message
      });

      res.status(200).json({
        success: true,
        message: 'Email sent'
      });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return res.status(500).json({
        success: false,
        message: 'Email could not be sent'
      });
    }
  } catch (error) {
    console.error('Error in forgotPassword:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
authController.resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid token'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Log user in
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Error in resetPassword:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// Export the controller
module.exports = authController;
