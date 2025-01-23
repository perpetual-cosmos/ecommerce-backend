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

// Get single order details
router.get('/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('product', 'name price category description')
      .populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(order);
  } catch (error) {
    console.error('Order fetch error:', error);
    res.status(500).json({ message: 'Server error fetching order' });
  }
});

// Download digital product
router.get('/download/:token', async (req, res) => {
  try {
    const order = await Order.findOne({ downloadToken: req.params.token })
      .populate('product', 'fileUrl name');
    
    if (!order) {
      return res.status(404).json({ message: 'Download link not found' });
    }
    
    if (order.status !== 'completed') {
      return res.status(403).json({ message: 'Order not completed' });
    }
    
    if (!order.downloadToken) {
      return res.status(403).json({ message: 'Download link has already been used' });
    }
    
    // Update download count and timestamp
    order.downloadCount += 1;
    order.lastDownloaded = new Date();
    
    // Invalidate token after first use (one-time download)
    order.downloadToken = null;
    await order.save();
    
    // Redirect to Cloudinary URL for download
    res.redirect(order.product.fileUrl);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Server error processing download' });
  }
});

// Get all orders (admin only)
router.get('/admin/all', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const skip = (page - 1) * limit;
    
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('product', 'name price category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Order.countDocuments(query);
    
    res.json({
      orders,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Admin orders fetch error:', error);
    res.status(500).json({ message: 'Server error fetching admin orders' });
  }
});

// Update order status (admin only)
router.put('/admin/:orderId/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { status } = req.body;
    
    if (!['pending', 'completed', 'failed', 'refunded'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status;
    await order.save();
    
    res.json({ 
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Order status update error:', error);
    res.status(500).json({ message: 'Server error updating order status' });
  }
});



module.exports = router;