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

// Get images by type for a product
router.get('/product/:product_id/:imageType', async (req, res) => {
  try {
    const { product_id, imageType } = req.params;
    
    // Verify product exists
    const product = await Product.findOne({ product_id, isActive: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const images = await Image.find({ 
      product_id, 
      imageType, 
      isActive: true 
    }).sort({ sortOrder: 1, createdAt: 1 });
    
    res.json(images);
  } catch (error) {
    console.error('Image fetch error:', error);
    res.status(500).json({ message: 'Server error fetching images' });
  }
});

// Upload image for a product (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { product_id, imageFile, imageType = 'gallery', altText, sortOrder = 0 } = req.body;
    
    if (!product_id || !imageFile) {
      return res.status(400).json({ message: 'Product ID and image file are required' });
    }
    
    // Verify product exists
    const product = await Product.findOne({ product_id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageFile, { 
      resource_type: 'image',
      folder: 'product-images',
      transformation: [
        { width: 800, height: 600, crop: 'limit' }
      ]
    });
    
    const image = new Image({
      product_id,
      imageUrl: uploadResult.secure_url,
      imageType,
      altText,
      sortOrder
    });
    
    await image.save();
    
    res.status(201).json({ 
      message: 'Image uploaded successfully',
      image
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ message: 'Server error uploading image' });
  }
});

// Update image (admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { imageType, altText, sortOrder, isActive } = req.body;
    
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Update fields
    if (imageType) image.imageType = imageType;
    if (altText !== undefined) image.altText = altText;
    if (sortOrder !== undefined) image.sortOrder = sortOrder;
    if (isActive !== undefined) image.isActive = isActive;
    
    await image.save();
    
    res.json({ 
      message: 'Image updated successfully',
      image
    });
  } catch (error) {
    console.error('Image update error:', error);
    res.status(500).json({ message: 'Server error updating image' });
  }
});

// Delete image (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const image = await Image.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    // Soft delete - set isActive to false
    image.isActive = false;
    await image.save();
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Image deletion error:', error);
    res.status(500).json({ message: 'Server error deleting image' });
  }
});



module.exports = router; 