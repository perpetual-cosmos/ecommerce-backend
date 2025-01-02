require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const authRoutes = require('./routes/auth');
// const productRoutes = require('./routes/product');
// const orderRoutes = require('./routes/order');
// const paymentRoutes = require('./routes/payment');
// const imageRoutes = require('./routes/image');
// const Stripe = require('stripe');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/image', imageRoutes);

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Enhanced MongoDB connection with better error handling
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { 
      useNewUrlParser: true, 
      useUnifiedTopology: true 
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection URL: ${process.env.MONGO_URI.replace(/\/\/.*@/, '//***:***@')}`);
    console.log(`🔄 Connection State: ${conn.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    console.error('Please check your MONGO_URI in .env file');
    process.exit(1);
  }
};


// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('📴 MongoDB connection closed through app termination');
    process.exit(0);
  } catch (err) {
    console.error('Error during shutdown:', err);
    process.exit(1);
  }
});

// Initialize database connection
connectDB();

app.listen(5000, () => {
  console.log('🚀 Server running on port 5000');
  console.log('📝 API Documentation: http://localhost:5000/api');
  console.log('🌐 Frontend: http://localhost:6600');
});

// Health check endpoint to verify database connection
app.get('/api/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: {
        status: states[dbState] || 'unknown',
        readyState: dbState,
        connected: dbState === 1
      },
      server: {
        uptime: process.uptime(),
        memory: process.memoryUsage()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      error: error.message
    });
  }
});