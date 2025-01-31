# Email Verification Setup Guide

## Issues Fixed

1. ✅ **Fixed nodemailer typo**: Changed `createTransporter` to `createTransport`
2. ✅ **Created frontend verification component**: `EmailVerification.js` with modern UI
3. ✅ **Added verification route**: Route is already configured in `App.js`
4. ✅ **Updated Register component**: Now stores email for verification

## Setup Steps

### 1. Create Environment File

Create a `.env` file in the `backend` folder with these variables:

```bash
# Copy from backend/env-template.txt and update with your values
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/digital-store
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# IMPORTANT: This fixes the "undefined" URL issue
FRONTEND_URL=http://localhost:3000

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Optional: SendGrid (uncomment if using SendGrid)
# SENDGRID_API_KEY=your-sendgrid-api-key
```

### 2. Email Configuration

#### For Gmail:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in `EMAIL_PASSWORD`

#### For SendGrid:
1. Create a SendGrid account
2. Get your API key
3. Uncomment the SendGrid configuration in `emailService.js`
4. Comment out the Gmail configuration

### 3. Test the Setup

1. **Start the backend server:**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Test email verification:**
   - Register a new account
   - Check your email for verification link
   - Click the link (should now work properly)
   - Verify your email
   - Try logging in

## How It Works

1. **Registration**: User registers → Email verification sent → Email stored in localStorage
2. **Email Link**: Clicking link goes to `/verify-email?token=xxx`
3. **Verification**: Frontend component calls backend API to verify token
4. **Success**: User redirected to login with success message
5. **Login**: Only verified users can log in

## Troubleshooting

### "undefined" in email link
- Make sure `FRONTEND_URL=http://localhost:3000` is set in `.env`

### Email not sending
- Check Gmail app password is correct
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- Check Gmail 2FA is enabled

### Verification link not working
- Ensure frontend is running on `http://localhost:3000`
- Check backend is running on `http://localhost:5000`
- Verify the route `/verify-email` exists in `App.js`

### Token expired
- Use "Resend Verification Email" button
- Tokens expire after 24 hours

## Files Created/Modified

- ✅ `frontend/src/components/EmailVerification.js` - New verification component
- ✅ `frontend/src/components/EmailVerification.css` - Styling for verification
- ✅ `backend/services/emailService.js` - Fixed nodemailer typo
- ✅ `frontend/src/components/Register.js` - Updated to store email
- ✅ `backend/env-template.txt` - Environment variables template

The email verification system is now fully functional! 🎉 