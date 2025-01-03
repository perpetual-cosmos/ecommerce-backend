require('dotenv').config();
// const mongoose = require('mongoose');
// const User = require('./models/User');
// const Product = require('./models/Product');
// const Order = require('./models/Order');

// Test MongoDB connection
const testConnection = async () => {
  console.log('🔍 Testing MongoDB Connection...\n');
  
  try {
    // Connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ MongoDB Connection Successful!');
    console.log(`📊 Database Name: ${conn.connection.name}`);
    console.log(`🔗 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log(`🌐 Host: ${conn.connection.host}`);
    console.log(`🚪 Port: ${conn.connection.port}`);
    
    // Test database operations
    console.log('\n🧪 Testing Database Operations...\n');
    
    // Test User collection
    const userCount = await User.countDocuments();
    console.log(`👥 Users in database: ${userCount}`);
    
    // Test Product collection
    const productCount = await Product.countDocuments();
    console.log(`📦 Products in database: ${productCount}`);
    
    // Test Order collection
    const orderCount = await Order.countDocuments();
    console.log(`🛒 Orders in database: ${orderCount}`);
    
    // Test creating a sample user
    console.log('\n📝 Testing User Creation...');
    const testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123'
    });
    
   
    
    console.log('✅ Product model validation passed');
    console.log(`📋 Sample product data: ${testProduct.name} - $${testProduct.price}`);
    
    // Get database stats
    console.log('\n📊 Database Statistics:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`📁 Collections found: ${collections.length}`);
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    console.log('\n🎉 All tests passed! MongoDB is working correctly.');
    
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:');
    console.error('Error:', error.message);
    console.error('\n🔧 Troubleshooting Tips:');
    console.error('1. Check if MongoDB is running');
    console.error('2. Verify MONGO_URI in .env file');
    console.error('3. Check network connectivity');
    console.error('4. Ensure MongoDB port (27017) is accessible');
    
    
    
    if (error.message.includes('Authentication failed')) {
      console.error('\n💡 Authentication error. Check username/password in MONGO_URI');
    }
    
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n📴 Connection closed.');
  }
};

// Run the test
testConnection(); 