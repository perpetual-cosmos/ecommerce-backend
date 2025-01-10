const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Create new order
router.post('/create', auth, async (req, res) => {
  try {
    const { productId, paymentId, amount, billingEmail } = req.body;
    
    if (!productId || !paymentId || !amount) {
      return res.status(400).json({ message: 'Product ID, payment ID, and amount are required' });
    }
    
    // Verify product exists and is active
    const product = await Product.findById(productId).where('isActive', true);
    if (!product) {
      return res.status(404).json({ message: 'Product not found or inactive' });
    }
    
    // Check if user already purchased this product
    const existingOrder = await Order.findOne({
      user: req.user.userId,
      product: productId,
      status: 'completed'
    });
    
    if (existingOrder) {
      return res.status(400).json({ message: 'You have already purchased this product' });
    }
    
    // Generate unique download token
    const downloadToken = uuidv4();
    
    const order = new Order({
      user: req.user.userId,
      product: productId,
      paymentId,
      amount,
      billingEmail: billingEmail || req.user.email,
      downloadToken,
      status: 'completed',
      paymentMethod: 'stripe'
    });
    
    await order.save();
    
    // Update product download count
    product.downloadCount += 1;
    await product.save();
    
    // Update user purchase stats
    const user = await User.findById(req.user.userId);
    user.totalPurchases += 1;
    user.totalSpent += amount;
    await user.save();
    
    res.status(201).json({ 
      message: 'Order created successfully',
      order: {
        id: order._id,
        downloadToken: order.downloadToken,
        amount: order.amount,
        status: order.status
      }
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
});

// Get user's order history
router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('product', 'name price category')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error('Order history fetch error:', error);
    res.status(500).json({ message: 'Server error fetching order history' });
  }
});



module.exports = router;