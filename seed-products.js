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
  },
  {
    product_id: 'prod-002',
    name: 'Ebook: Learn JavaScript',
    description: 'A comprehensive guide to modern JavaScript programming.',
    price: 19.99,
    offer_price: 9.99,
    category: 'ebook',
    fileUrl: 'https://www.example.com/downloads/js-ebook.pdf',
    fileSize: 1024,
    imageUrl: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
  },
  {
    product_id: 'prod-003',
    name: 'Website Template',
    description: 'A modern, responsive website template for startups.',
    price: 49.99,
    offer_price: 29.99,
    category: 'template',
    fileUrl: 'https://www.example.com/downloads/template.zip',
    fileSize: 3072,
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
  },
  {
    product_id: 'prod-004',
    name: 'Online Course: React Basics',
    description: 'Learn the fundamentals of React with this beginner-friendly course.',
    price: 59.99,
    offer_price: 39.99,
    category: 'course',
    fileUrl: 'https://www.example.com/downloads/react-course.zip',
    fileSize: 4096,
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let user = await User.findOne({ email: DUMMY_USER_EMAIL });
  if (!user) {
    user = new User({
      name: 'Seed User',
      email: DUMMY_USER_EMAIL,
      password: 'hashedpassword123', // You may want to hash this in a real app
      isVerified: true,
    });
    await user.save();
    console.log('Created dummy user.');
  }

  // Remove old dummy products
  await Product.deleteMany({ createdBy: user._id });

  // Insert new dummy products
  for (const prod of dummyProducts) {
    await Product.create({
      ...prod,
      createdBy: user._id,
    });
  }

  console.log('Seeded dummy products!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  mongoose.disconnect();
}); 