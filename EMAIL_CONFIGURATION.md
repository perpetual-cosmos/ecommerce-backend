# 📧 Email Verification Configuration Guide

## 🚀 Quick Setup

Follow these steps to configure email verification for your e-commerce platform.

## 📋 Prerequisites

- Gmail account (for development) OR SendGrid account (for production)
- Access to your email account settings

## 🔧 Step-by-Step Configuration

### **Step 1: Create .env File**

Create a `.env` file in the `backend` directory with the following content:

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

# Frontend URL (for CORS and email links)
FRONTEND_URL=http://localhost:3000
```

### **Step 2: Configure Gmail (Recommended for Development)**

#### **Option A: Gmail with App Password (Recommended)**

1. **Enable 2-Factor Authentication:**
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Click on "Security"
   - Enable "2-Step Verification"

2. **Generate App Password:**
   - Go to [Google Account Settings](https://myaccount.google.com/)
   - Click on "Security"
   - Under "2-Step Verification", click "App passwords"
   - Select "Mail" as the app
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env file:**
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ```

#### **Option B: Gmail with Less Secure Apps (Not Recommended)**
- Go to [Google Account Settings](https://myaccount.google.com/)
- Click on "Security"
- Turn on "Less secure app access"
- Use your regular Gmail password

### **Step 3: Configure SendGrid (Recommended for Production)**

1. **Create SendGrid Account:**
   - Go to [SendGrid](https://sendgrid.com/)
   - Sign up for a free account
   - Verify your email address

2. **Get API Key:**
   - Go to SendGrid Dashboard
   - Navigate to Settings → API Keys
   - Create a new API Key
   - Copy the API key

3. **Update Email Service Configuration:**
   - Open `backend/services/emailService.js`
   - Comment out the Gmail configuration
   - Uncomment the SendGrid configuration:
   ```javascript
   // Comment out Gmail configuration
   // return nodemailer.createTransporter({
   //   service: 'gmail',
   //   auth: {
   //     user: process.env.EMAIL_USER,
   //     pass: process.env.EMAIL_PASSWORD
   //   }
   // });
   
   // Uncomment SendGrid configuration
   return nodemailer.createTransporter({
     host: 'smtp.sendgrid.net',
     port: 587,
     auth: {
       user: 'apikey',
       pass: process.env.SENDGRID_API_KEY
     }
   });
   ```

4. **Update .env file:**
   ```env
   SENDGRID_API_KEY=your_sendgrid_api_key
   ```

### **Step 4: Test Email Configuration**

1. **Start the backend server:**
   ```bash
   cd backend
   npm run dev
   ```

2. **Test registration:**
   - Go to `http://localhost:3000/register`
   - Create a new account
   - Check your email for verification link

3. **Test email sending via API:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"your-email@example.com","password":"password123"}'
   ```

## 🔍 Troubleshooting

### **Common Gmail Issues:**

1. **"Invalid login" Error:**
   - Ensure 2FA is enabled
   - Use app password, not regular password
   - Check if app password is correct

2. **"Username and Password not accepted" Error:**
   - Verify email address is correct
   - Ensure app password is 16 characters
   - Check if 2FA is properly enabled

3. **"Less secure app access" Error:**
   - Enable "Less secure app access" in Google settings
   - Or use app password method (recommended)

### **Common SendGrid Issues:**

1. **"Authentication failed" Error:**
   - Verify API key is correct
   - Ensure API key has "Mail Send" permissions
   - Check if account is verified

2. **"Rate limit exceeded" Error:**
   - Free tier has 100 emails/day limit
   - Upgrade to paid plan for more emails

### **General Email Issues:**

1. **Emails not sending:**
   - Check server logs for errors
   - Verify all environment variables are set
   - Test with different email service

2. **Emails going to spam:**
   - Check spam folder
   - Add sender email to contacts
   - Use professional email service for production

## 🧪 Testing Checklist

- [ ] Backend server starts without errors
- [ ] Registration sends verification email
- [ ] Verification email contains correct link
- [ ] Clicking verification link works
- [ ] Login works after verification
- [ ] Resend verification email works
- [ ] Expired tokens are handled properly

## 🚀 Production Deployment

### **For Heroku:**
```bash
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set FRONTEND_URL=https://your-frontend-domain.com
```

### **For Vercel/Netlify:**
- Set environment variables in deployment dashboard
- Ensure FRONTEND_URL points to your production domain

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Test with a different email service
4. Check server logs for detailed error messages
5. Ensure email service credentials are correct

## 🎯 Next Steps

After successful email configuration:

1. **Test the complete flow** - Registration → Email → Verification → Login
2. **Customize email templates** - Update branding in `emailService.js`
3. **Add password reset** - Extend email service for password recovery
4. **Monitor email delivery** - Set up email analytics
5. **Scale up** - Consider professional email service for production 