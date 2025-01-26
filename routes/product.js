const express = require('express');
const cloudinary = require('../config/cloudinary');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all active products (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, sort = 'createdAt', order = 'desc' } = req.query;
    
    let query = { isActive: true };
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    const sortOptions = {};
    sortOptions[sort] = order === 'desc' ? -1 : 1;
    
    const products = await Product.find(query)
      .sort(sortOptions)
      .populate('createdBy', 'name');
    
    res.json(products);
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ message: 'Server error fetching products' });
  }
});






module.exports = router;