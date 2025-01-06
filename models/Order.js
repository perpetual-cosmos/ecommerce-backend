const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  },
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product',
    required: true
  },
  paymentId: { 
    type: String 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    default: 'usd' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  downloadToken: { 
    type: String 
  },
  downloadCount: { 
    type: Number, 
    default: 0 
  },
  lastDownloaded: { 
    type: Date 
  },
  paymentMethod: { 
    type: String 
  },
  billingEmail: { 
    type: String 
  }
}, {
  timestamps: true
});

// Add index for better query performance
orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ downloadToken: 1 });
orderSchema.index({ paymentId: 1 });

module.exports = mongoose.model('Order', orderSchema);