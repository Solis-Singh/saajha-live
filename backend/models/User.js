const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Configure bcrypt settings
const SALT_ROUNDS = 10;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/ddefuuqkl/image/upload/v1618771489/default-avatar_f5wftj.png'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
});

// Function to validate password format
UserSchema.methods.validatePasswordFormat = function(password) {
  if (!password) {
    throw new Error('Password is required');
  }
  
  const trimmedPassword = password.trim();
  if (trimmedPassword.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }
  
  if (trimmedPassword !== password) {
    throw new Error('Password contains leading or trailing whitespace');
  }
  
  console.log('Password validation passed:', {
    length: password.length,
    containsWhitespace: /\s/.test(password),
    buffer: Buffer.from(password).toString('hex')
  });
  
  return true;
};

// Password is now hashed in the controller before reaching the model
UserSchema.pre('save', function(next) {
  console.log('Pre-save hook: Password should already be hashed in controller');
  next();
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  try {
    console.log('Matching password...');
    console.log('Stored password hash:', this.password);
    console.log('Entered password:', enteredPassword);
    
    if (!this.password) {
      console.log('No password stored for user');
      return false;
    }

    // Check if the stored password is already a hash
    const isHash = /^\$2[ayb]\$.{56}$/.test(this.password);
    console.log('Is stored password a hash?', isHash);

    if (!isHash) {
      console.log('Stored password is not a hash, this should not happen');
      return false;
    }

    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    console.log('Password match result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error in matchPassword:', error);
    return false;
  }
};

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

module.exports = mongoose.model('User', UserSchema);
