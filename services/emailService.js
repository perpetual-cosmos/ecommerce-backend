const nodemailer = require('nodemailer');

// Create transporter for sending emails
const createTransporter = () => {
  // For development, you can use Gmail or other services
  // For production, use services like SendGrid, Mailgun, or AWS SES
  
  // Gmail configuration (for development)
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD // Use app password for Gmail
    }
  });
  
  // Alternative: SendGrid configuration
  // return nodemailer.createTransport({
  //   host: 'smtp.sendgrid.net',
  //   port: 587,
  //   auth: {
  //     user: 'apikey',
  //     pass: process.env.SENDGRID_API_KEY
  //   }
  // });
};

// Email templates
const emailTemplates = {
  verificationEmail: (name, verificationUrl) => ({
    subject: 'Verify Your Email - DigitalStore',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">DigitalStore</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Email Verification</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${name}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Thank you for registering with DigitalStore! To complete your registration and start exploring our digital products, please verify your email address by clicking the button below.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block; 
                      font-weight: 600;
                      font-size: 16px;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
            If the button doesn't work, you can copy and paste this link into your browser:
          </p>
          
          <p style="background: #f8fafc; padding: 15px; border-radius: 5px; word-break: break-all;">
            <a href="${verificationUrl}" style="color: #667eea;">${verificationUrl}</a>
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              This verification link will expire in 24 hours. If you didn't create an account with DigitalStore, you can safely ignore this email.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>&copy; 2024 DigitalStore. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      Hello ${name}!
      
      Thank you for registering with DigitalStore! To complete your registration and start exploring our digital products, please verify your email address by visiting this link:
      
      ${verificationUrl}
      
      This verification link will expire in 24 hours. If you didn't create an account with DigitalStore, you can safely ignore this email.
      
      Best regards,
      The DigitalStore Team
    `
  }),
  
  welcomeEmail: (name) => ({
    subject: 'Welcome to DigitalStore!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">DigitalStore</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Welcome!</p>
        </div>
        
        <div style="background: white; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Welcome to DigitalStore, ${name}! 🎉</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Your email has been successfully verified! You now have full access to our platform and can start exploring our amazing collection of digital products.
          </p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #0369a1; margin-top: 0;">What you can do now:</h3>
            <ul style="color: #666; line-height: 1.8;">
              <li>Browse our digital products</li>
              <li>Make secure purchases</li>
              <li>Download your purchased products</li>
              <li>Track your order history</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/products" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; 
                      padding: 15px 30px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block; 
                      font-weight: 600;
                      font-size: 16px;">
              Start Shopping
            </a>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
          <p>&copy; 2024 DigitalStore. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      Welcome to DigitalStore, ${name}! 🎉
      
      Your email has been successfully verified! You now have full access to our platform and can start exploring our amazing collection of digital products.
      
      What you can do now:
      - Browse our digital products
      - Make secure purchases
      - Download your purchased products
      - Track your order history
      
      Start shopping at: ${process.env.FRONTEND_URL}/products
      
      Best regards,
      The DigitalStore Team
    `
  })
};

// Send email function
const sendEmail = async (to, template, data = {}) => {
  try {
    const transporter = createTransporter();
    const emailContent = emailTemplates[template](data.name, data.verificationUrl);
    
    const mailOptions = {
      from: `"DigitalStore" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message };
  }
};



module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendWelcomeEmail
}; 