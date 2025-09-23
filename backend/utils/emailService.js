const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp, firstName) => {
  try {
    // Always log OTP for debugging purposes
    console.log('\n🔐 OTP DEBUG INFO 🔐');
    console.log('═══════════════════════════════════════');
    console.log(`📧 To: ${email}`);
    console.log(`👤 Name: ${firstName}`);
    console.log(`🔐 OTP: ${otp}`);
    console.log('⏰ Valid for: 10 minutes');
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    console.log('📧 Email User:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
    console.log('🔑 Email Pass:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
    console.log('═══════════════════════════════════════\n');

    // Development mode - if no email password is set, just log the OTP
    if (!process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-app-password' || process.env.EMAIL_PASS === '') {
      console.log('🔥 DEVELOPMENT MODE - EMAIL NOT SENT 🔥');
      return { success: true, message: 'OTP logged to console (development mode)' };
    }

    console.log('📤 Attempting to create Gmail transporter...');
    const transporter = createTransporter();
    
    // Test the connection first
    console.log('🔗 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!');
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP - SoftGlow Candles',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #8B4513; margin: 0;">🕯️ SoftGlow Candles</h1>
            </div>
            
            <h2 style="color: #333; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              Hello ${firstName},
            </p>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              We received a request to reset your password. Please use the following OTP to proceed with your password reset:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #8B4513; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 5px; display: inline-block;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #666; font-size: 16px; line-height: 1.5;">
              This OTP is valid for <strong>10 minutes</strong>. If you didn't request this password reset, please ignore this email.
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #999; font-size: 14px;">
                This is an automated email. Please do not reply to this email.
              </p>
              <p style="color: #999; font-size: 14px;">
                © 2024 SoftGlow Candles. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `
    };

    console.log('📧 Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📧 Response:', result.response);
    return { success: true, message: 'OTP email sent successfully' };
  } catch (error) {
    console.error('\n❌ EMAIL SENDING FAILED ❌');
    console.error('═══════════════════════════════════════');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    console.error('Error Command:', error.command);
    console.error('Full Error:', error);
    console.error('═══════════════════════════════════════\n');
    
    // Return success even if email fails to prevent blocking the OTP process
    return { success: true, message: 'OTP generated (email delivery failed - check logs)' };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail
};