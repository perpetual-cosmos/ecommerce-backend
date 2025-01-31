# E-commerce Digital Products Platform - Setup Guide

## 🚀 Quick Start

This guide will help you set up and run the e-commerce platform for digital products with email verification.

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager
- Stripe account (for payments)
- Cloudinary account (for file storage)
- Email service account (Gmail, SendGrid, etc. for email verification)

## 🔧 Step-by-Step Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd Ecommerce-digital-product

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/digital-products-store

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email Configuration (for email verification)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
# Alternative: SendGrid
# SENDGRID_API_KEY=your_sendgrid_api_key

# Frontend URL (for CORS and email links)
FRONTEND_URL=http://localhost:3000
```

### 3. Set Up External Services

#### MongoDB Setup
- **Local MongoDB**: Install and start MongoDB locally
- **MongoDB Atlas**: Create a free cluster and get your connection string

#### Stripe Setup
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your test API keys from the Stripe Dashboard
3. Set up webhook endpoints (optional for development)

#### Cloudinary Setup
1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret from the dashboard

#### Email Setup (for Email Verification)

**Option 1: Gmail (Recommended for Development)**
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
3. Use your Gmail address and the app password in the .env file

**Option 2: SendGrid (Recommended for Production)**
1. Create a SendGrid account at [sendgrid.com](https://sendgrid.com)
2. Get your API key from the SendGrid dashboard
3. Uncomment the SendGrid configuration in `backend/services/emailService.js`
4. Comment out the Gmail configuration

**Option 3: Other Email Services**
- Mailgun, AWS SES, or other SMTP services can be configured
- Update the `createTransporter` function in `emailService.js`

### 4. Start the Application

#### Development Mode
```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm start
```

#### Production Mode
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
```

### 5. Create Admin User

After starting the application, you'll need to create an admin user:

1. Register a new user through the frontend
2. Verify the email address by clicking the link in the email
3. Manually update the user's role to 'admin' in the database:

```javascript
// In MongoDB shell or MongoDB Compass
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## 🧪 Testing the Application

### 1. Test User Registration with Email Verification
- Navigate to `http://localhost:3000/register`
- Create a new user account
- Check your email for verification link
- Click the verification link
- Verify successful email verification

### 2. Test User Login with Email Verification
- Navigate to `http://localhost:3000/login`
- Try to login with unverified email (should show verification required)
- Verify email and try logging in again
- Verify successful login and token storage

### 3. Test Email Verification Features
- Test resend verification email functionality
- Test expired verification links
- Test invalid verification tokens

### 4. Test Product Creation (Admin Only)
- Login as an admin user
- Navigate to the admin dashboard
- Create a new product with file upload

### 5. Test Payment Flow
- Browse products as a regular user
- Select a product to purchase
- Complete the Stripe payment flow
- Verify order creation and download link generation

### 6. Test Download Functionality
- Use the generated download link
- Verify one-time download works
- Confirm link becomes invalid after use

## 🔍 API Testing

You can test the API endpoints using tools like Postman or curl:

### Authentication with Email Verification
```bash
# Register user (sends verification email)
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Verify email (use token from email)
curl http://localhost:5000/api/auth/verify-email/TOKEN_FROM_EMAIL

# Resend verification email
curl -X POST http://localhost:5000/api/auth/resend-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Login user (requires verified email)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Products
```bash
# Get all products
curl http://localhost:5000/api/product

# Get single product
curl http://localhost:5000/api/product/PRODUCT_ID
```

### Orders
```bash
# Get user orders (requires auth token)
curl http://localhost:5000/api/order/my-orders \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MongoDB is running
   - Check connection string in .env file
   - Ensure database name is correct

2. **Stripe Payment Errors**
   - Verify Stripe API keys are correct
   - Use test card numbers for testing
   - Check Stripe dashboard for error logs

3. **File Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits
   - Ensure proper file format

4. **Email Sending Issues**
   - Verify email credentials in .env file
   - For Gmail: Ensure 2FA is enabled and app password is used
   - For SendGrid: Verify API key is correct
   - Check email service logs for errors

5. **Email Verification Issues**
   - Check spam folder for verification emails
   - Verify FRONTEND_URL is correct in .env
   - Ensure email service is properly configured

6. **CORS Errors**
   - Verify FRONTEND_URL in .env
   - Check browser console for CORS errors
   - Ensure backend is running on correct port

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=*
```

## 📊 Monitoring

### Backend Logs
- Check console output for server logs
- Monitor MongoDB connection status
- Watch for payment processing errors
- Monitor email sending status

### Frontend Logs
- Check browser console for errors
- Monitor network requests
- Verify token storage and retrieval
- Check email verification flow

## 🔒 Security Checklist

- [ ] Change default JWT secret
- [ ] Use HTTPS in production
- [ ] Set up proper CORS configuration
- [ ] Implement rate limiting
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Set up proper error handling
- [ ] Implement request logging
- [ ] Configure secure email service
- [ ] Set up email verification
- [ ] Implement password reset functionality

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
# Add to package.json
"engines": {
  "node": "16.x"
}

# Deploy
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set STRIPE_SECRET_KEY=your_stripe_secret
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloudinary_name
heroku config:set CLOUDINARY_API_KEY=your_cloudinary_key
heroku config:set CLOUDINARY_API_SECRET=your_cloudinary_secret
heroku config:set EMAIL_USER=your_email
heroku config:set EMAIL_PASSWORD=your_email_password
heroku config:set FRONTEND_URL=https://your-frontend-domain.com
git push heroku main
```

### Frontend Deployment (Netlify/Vercel)
```bash
# Build the application
npm run build

# Deploy the build folder to your preferred platform
```

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the error logs
3. Verify all environment variables are set correctly
4. Ensure all dependencies are installed
5. Check that all external services are properly configured
6. Test email functionality with a valid email service

## 🎯 Next Steps

After successful setup:

1. **Customize the UI**: Modify colors, fonts, and layout
2. **Add More Features**: Implement password reset, email notifications
3. **Enhance Security**: Add rate limiting, input validation
4. **Scale Up**: Optimize database queries, add caching
5. **Monitor**: Set up logging and monitoring tools
6. **Email Features**: Add password reset, order notifications

## 📝 Notes

- This is a development setup. For production, ensure proper security measures
- Test thoroughly with Stripe test cards before going live
- Keep your API keys secure and never commit them to version control
- Regularly update dependencies for security patches
- Email verification adds an extra layer of security to your platform
- Use a reliable email service for production deployments 