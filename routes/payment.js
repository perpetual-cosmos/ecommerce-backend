const express = require('express');
const Stripe = require('stripe');
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { productId, productIds } = req.body;
    let products = [];
    if (productIds && Array.isArray(productIds) && productIds.length > 0) {
      // Multi-product cart checkout
      products = await Product.find({ _id: { $in: productIds }, isActive: true });
      if (products.length !== productIds.length) {
        return res.status(404).json({ message: 'One or more products not found or inactive' });
      }
      // Check for already purchased products
      const existingOrders = await Order.find({
        user: req.user.userId,
        product: { $in: productIds },
        status: 'completed'
      });
      if (existingOrders.length > 0) {
        return res.status(400).json({ message: 'You have already purchased one or more products in your cart' });
      }
      // Calculate total
      const total = products.reduce((sum, p) => sum + (p.offer_price || p.price), 0);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        currency: 'usd',
        metadata: {
          productIds: productIds.join(','),
          userId: req.user.userId,
          productNames: products.map(p => p.name).join(', ')
        },
        automatic_payment_methods: { enabled: true },
      });
      res.json({
        clientSecret: paymentIntent.client_secret,
        amount: total,
        products: products.map(p => ({ id: p._id, name: p.name, description: p.description }))
      });
      return;
    }
    // Single product checkout (legacy)
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }
    const product = await Product.findById(productId).where('isActive', true);
    if (!product) {
      return res.status(404).json({ message: 'Product not found or inactive' });
    }
    const existingOrder = await Order.findOne({
      user: req.user.userId,
      product: productId,
      status: 'completed'
    });
    if (existingOrder) {
      return res.status(400).json({ message: 'You have already purchased this product' });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(product.price * 100),
      currency: 'usd',
      metadata: {
        productId,
        userId: req.user.userId,
        productName: product.name
      },
      automatic_payment_methods: { enabled: true },
    });
    res.json({
      clientSecret: paymentIntent.client_secret,
      amount: product.price,
      product: {
        id: product._id,
        name: product.name,
        description: product.description
      }
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ message: 'Server error creating payment intent' });
  }
});

// Confirm payment and create order
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { paymentIntentId, productId } = req.body;
    
    if (!paymentIntentId || !productId) {
      return res.status(400).json({ message: 'Payment intent ID and product ID are required' });
    }
    
    // Verify payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }
    
    // Verify product
    const product = await Product.findById(productId).where('isActive', true);
    if (!product) {
      return res.status(404).json({ message: 'Product not found or inactive' });
    }
    
    // Check if order already exists
    const existingOrder = await Order.findOne({
      user: req.user.userId,
      product: productId,
      paymentId: paymentIntentId
    });
    
    if (existingOrder) {
      return res.status(400).json({ message: 'Order already exists for this payment' });
    }
    
    // Create order (this will be handled by the order creation route)
    res.json({ 
      message: 'Payment confirmed successfully',
      paymentIntentId,
      productId
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Server error confirming payment' });
  }
});

// Get payment methods for user
router.get('/payment-methods', auth, async (req, res) => {
  try {
    // In a real application, you would store customer IDs
    // For now, we'll return an empty array
    res.json({ paymentMethods: [] });
  } catch (error) {
    console.error('Payment methods fetch error:', error);
    res.status(500).json({ message: 'Server error fetching payment methods' });
  }
});

// Stripe webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // You can add additional logic here like sending confirmation emails
      break;
      
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;
      
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Get payment status
router.get('/status/:paymentIntentId', auth, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    res.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      currency: paymentIntent.currency,
      created: paymentIntent.created
    });
  } catch (error) {
    console.error('Payment status fetch error:', error);
    res.status(500).json({ message: 'Server error fetching payment status' });
  }
});

module.exports = router;