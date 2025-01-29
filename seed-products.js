require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const DUMMY_USER_EMAIL = 'seeduser@example.com';

const dummyProducts = [
  {
    product_id: 'prod-001',
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation.',
    price: 99.99,
    offer_price: 79.99,
    category: 'other',
    fileUrl: 'https://www.example.com/downloads/headphones.pdf',
    fileSize: 2048,
    imageUrl: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167',
  }
];



 
}

seed().catch((err) => {
  console.error(err);
  mongoose.disconnect();
}); 