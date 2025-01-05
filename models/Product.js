const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 500
  },
  price: { 
    type: Number, 
    required: true,
    min: 0
  },
 
 
  
}, {
  timestamps: true
});

// Add index for better query performance
productSchema.index({ product_id: 1 });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ createdBy: 1 });

module.exports = mongoose.model('Product', productSchema);