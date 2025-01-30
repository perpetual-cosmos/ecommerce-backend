const nodemailer = require('nodemailer');
require('dotenv').config();

// Test email configuration
async function testEmailConfig() {
  console.log('🧪 Testing Email Configuration...\n');

  // Check environment variables
  console.log('📋 Environment Variables:');
  console.log(`EMAIL_USER: ${process.env.EMAIL_USER ? '✅ Set' : '❌ Missing'}`);
  console.log(`EMAIL_PASSWORD: ${process.env.EMAIL_PASSWORD ? '✅ Set' : '❌ Missing'}`);
  console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL ? '✅ Set' : '❌ Missing'}`);
  console.log('');

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('❌ Missing email configuration. Please set EMAIL_USER and EMAIL_PASSWORD in your .env file.');
    return;
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    console.log('📧 Creating email transporter...');

    // Verify connection
    console.log('🔍 Verifying connection...');
    await transporter.verify();
    console.log('✅ Email connection verified successfully!\n');

    // Test email
    console.log('📤 Sending test email...');
    const testEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: '🧪 Email Verification Test - Digital Products Store',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2c3e50; margin: 0;">🎉 Email Test Successful!</h1>
            <p style="color: #7f8c8d; margin: 10px 0 0 0;">Digital Products Store</p>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #27ae60; margin-top: 0;">✅ Configuration Verified</h2>
            <p style="color: #2c3e50; line-height: 1.6;">
              Your email configuration is working perfectly! This test email confirms that:
            </p>
            <ul style="color: #2c3e50; line-height: 1.6;">
              <li>✅ SMTP connection is established</li>
              <li>✅ Authentication is successful</li>
              <li>✅ Emails can be sent</li>
              <li>✅ HTML formatting works</li>
            </ul>
            
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #27ae60; font-weight: bold;">
                🚀 You're ready to test the full email verification flow!
              </p>
            </div>
            
            <p style="color: #7f8c8d; font-size: 14px; margin-top: 30px;">
              Sent at: ${new Date().toLocaleString()}<br>
              From: ${process.env.EMAIL_USER}
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📬 Check your inbox: ${process.env.EMAIL_USER}\n`);

    console.log('🎯 Next Steps:');
    console.log('1. Check your email inbox for the test email');
    console.log('2. If you received it, your configuration is working!');
    console.log('3. Start your backend server: npm run dev');
    console.log('4. Test the full registration flow at http://localhost:3000/register');

  } catch (error) {
    console.log('❌ Email test failed:');
    console.log(error.message);
    
  
    
   
  }
}

// Run the test
testEmailConfig(); 