const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

// Initialize SendGrid if API key is available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Gmail SMTP Service
const sendViaGmail = async (email, otp, firstName) => {
  try {
    console.log('📧 Attempting Gmail SMTP...');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Gmail credentials not configured');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Test connection
    await transporter.verify();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your SoftGlow Password Reset OTP',
      html: createEmailHTML(otp, firstName)
    };

    const result = await transporter.sendMail(mailOptions);
    
    return {
      success: true,
      message: 'Email sent via Gmail SMTP',
      messageId: result.messageId,
      provider: 'Gmail'
    };

  } catch (error) {
    console.log('❌ Gmail SMTP failed:', error.message);
    throw error;
  }
};

// SendGrid Service
const sendViaSendGrid = async (email, otp, firstName) => {
  try {
    console.log('📧 Attempting SendGrid...');
    
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SendGrid API key not configured');
    }

    if (!process.env.EMAIL_FROM) {
      throw new Error('EMAIL_FROM not configured for SendGrid');
    }

    const msg = {
      to: email,
      from: {
        email: process.env.EMAIL_FROM,
        name: 'SoftGlow'
      },
      subject: 'Your SoftGlow Password Reset OTP',
      html: createEmailHTML(otp, firstName),
      text: createEmailText(otp, firstName)
    };

    const result = await sgMail.send(msg);
    
    return {
      success: true,
      message: 'Email sent via SendGrid',
      messageId: result[0].headers['x-message-id'],
      provider: 'SendGrid'
    };

  } catch (error) {
    console.log('❌ SendGrid failed:', error.message);
    throw error;
  }
};

// Create HTML email template
const createEmailHTML = (otp, firstName) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset OTP</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px;">
        <!-- Header -->
        <div style="text-align: center; padding: 20px 0; border-bottom: 2px solid #e0e0e0;">
          <h1 style="color: #333; margin: 0; font-size: 28px;">🔐 SoftGlow</h1>
          <p style="color: #666; margin: 5px 0 0 0;">Password Reset Request</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 30px 0;">
          <h2 style="color: #333; margin: 0 0 20px 0;">Hello ${firstName || 'Valued Customer'},</h2>
          
          <p style="color: #555; line-height: 1.6; margin: 0 0 20px 0;">
            We received a request to reset your password. Use the OTP below to proceed with your password reset:
          </p>
          
          <!-- OTP Box -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; text-align: center; border-radius: 10px; margin: 30px 0;">
            <p style="color: white; margin: 0 0 10px 0; font-size: 16px;">Your OTP Code</p>
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 8px; display: inline-block;">
              <span style="color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${otp}
              </span>
            </div>
          </div>
          
          <!-- Important Info -->
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>⏰ Important:</strong> This OTP is valid for only <strong>10 minutes</strong>. 
              Please use it immediately to reset your password.
            </p>
          </div>
          
          <p style="color: #555; line-height: 1.6; margin: 20px 0 0 0;">
            If you didn't request this password reset, please ignore this email. Your account remains secure.
          </p>
        </div>
        
        <!-- Footer -->
        <div style="border-top: 2px solid #e0e0e0; padding: 20px 0; text-align: center;">
          <p style="color: #888; margin: 0; font-size: 12px;">
            This email was sent by SoftGlow. Please do not reply to this email.
          </p>
          <p style="color: #888; margin: 5px 0 0 0; font-size: 12px;">
            © ${new Date().getFullYear()} SoftGlow. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Create text email template
const createEmailText = (otp, firstName) => {
  return `
Hello ${firstName || 'Valued Customer'},

Your SoftGlow password reset OTP is: ${otp}

This OTP is valid for 10 minutes. Please use it to reset your password.

If you didn't request this, please ignore this email.

- SoftGlow Team
  `.trim();
};

// Main email sending function with fallback
const sendOTPEmail = async (email, otp, firstName) => {
  console.log('\n🔐 UNIFIED EMAIL SERVICE 🔐');
  console.log('═══════════════════════════════════════');
  console.log(`📧 To: ${email}`);
  console.log(`👤 Name: ${firstName}`);
  console.log(`🔐 OTP: ${otp}`);
  console.log('⏰ Valid for: 10 minutes');
  console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
  console.log('═══════════════════════════════════════\n');

  // Define email providers in order of preference
  const providers = [
    {
      name: 'Gmail SMTP',
      service: sendViaGmail,
      available: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS)
    },
    {
      name: 'SendGrid',
      service: sendViaSendGrid,
      available: !!(process.env.SENDGRID_API_KEY && process.env.EMAIL_FROM)
    }
  ];

  // Filter available providers
  const availableProviders = providers.filter(p => p.available);
  
  if (availableProviders.length === 0) {
    console.log('❌ No email providers configured!');
    return {
      success: false,
      message: 'No email providers configured',
      error: 'Missing email service configuration'
    };
  }

  console.log(`📊 Available providers: ${availableProviders.map(p => p.name).join(', ')}`);

  // Try each provider in order
  for (let i = 0; i < availableProviders.length; i++) {
    const provider = availableProviders[i];
    
    try {
      console.log(`\n🔄 Trying provider ${i + 1}/${availableProviders.length}: ${provider.name}`);
      
      const result = await provider.service(email, otp, firstName);
      
      if (result.success) {
        console.log(`✅ Email sent successfully via ${provider.name}!`);
        console.log(`📧 Message ID: ${result.messageId}`);
        console.log('═══════════════════════════════════════\n');
        
        return result;
      }
      
    } catch (error) {
      console.log(`❌ ${provider.name} failed: ${error.message}`);
      
      // If this is the last provider, return the error
      if (i === availableProviders.length - 1) {
        console.log('❌ All email providers failed!');
        console.log('═══════════════════════════════════════\n');
        
        return {
          success: false,
          message: 'All email providers failed',
          error: error.message,
          lastProvider: provider.name
        };
      }
      
      // Otherwise, continue to next provider
      console.log(`🔄 Falling back to next provider...`);
    }
  }

  // This should never be reached, but just in case
  return {
    success: false,
    message: 'Unexpected error in email service',
    error: 'Unknown error occurred'
  };
};

module.exports = {
  generateOTP,
  sendOTPEmail
};