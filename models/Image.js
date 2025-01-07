const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
    ref: 'Product',
    trim: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  imageType: {
    type: String,
    enum: ['thumbnail', 'gallery', 'banner', 'other'],
    default: 'gallery'
  },
  altText: {
    type: String,
    trim: true,
    maxlength: 200
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
imageSchema.index({ product_id: 1 });
imageSchema.index({ product_id: 1, imageType: 1 });
imageSchema.index({ product_id: 1, isActive: 1 });
imageSchema.index({ product_id: 1, sortOrder: 1 });

module.exports = mongoose.model('Image', imageSchema); 