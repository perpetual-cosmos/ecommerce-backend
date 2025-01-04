const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 50
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  // Email verification fields
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: {
    type: String
  },
  emailVerificationExpires: {
    type: Date
  },
  lastLogin: { 
    type: Date 
  },
  totalPurchases: { 
    type: Number, 
    default: 0 
  },
  totalSpent: { 
    type: Number, 
    default: 0 
  }
}, {
  timestamps: true
});

// Add index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1, isActive: 1 });
userSchema.index({ emailVerificationToken: 1 });

module.exports = mongoose.model('User', userSchema);