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

// Get single product by product_id (public)
router.get('/by-id/:product_id', async (req, res) => {
  try {
    const product = await Product.findOne({ 
      product_id: req.params.product_id, 
      isActive: true 
    }).populate('createdBy', 'name');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

// Get single product by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'name')
      .where('isActive', true);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ message: 'Server error fetching product' });
  }
});

// Create new product (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { product_id, name, description, price, offer_price, category, file } = req.body;
    
    if (!product_id || !name || !description || !price || !category || !file) {
      return res.status(400).json({ message: 'All required fields are missing' });
    }
    
    if (price <= 0) {
      return res.status(400).json({ message: 'Price must be greater than 0' });
    }
    
    if (offer_price && offer_price <= 0) {
      return res.status(400).json({ message: 'Offer price must be greater than 0' });
    }
    
    // Check if product_id already exists
    const existingProduct = await Product.findOne({ product_id });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product ID already exists' });
    }
    
    // Upload file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(file, { 
      resource_type: 'raw',
      folder: 'digital-products'
    });
    
    const product = new Product({
      product_id,
      name,
      description,
      price,
      offer_price,
      category,
      fileUrl: uploadResult.secure_url,
      fileSize: uploadResult.bytes,
      createdBy: req.user.userId
    });
    
    await product.save();
    
    res.status(201).json({ 
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});




module.exports = router;