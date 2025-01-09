const express = require('express');
const cloudinary = require('../config/cloudinary');
const Image = require('../models/Image');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all images for a product
router.get('/product/:product_id', async (req, res) => {
  try {
    const { product_id } = req.params;
    
    // Verify product exists
    const product = await Product.findOne({ product_id, isActive: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const images = await Image.find({ 
      product_id, 
      isActive: true 
    }).sort({ sortOrder: 1, createdAt: 1 });
    
    res.json(images);
  } catch (error) {
    console.error('Image fetch error:', error);
    res.status(500).json({ message: 'Server error fetching images' });
  }
});







module.exports = router; 