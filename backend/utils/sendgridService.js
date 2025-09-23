const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email via SendGrid
const sendOTPEmail = async (email, otp, firstName) => {
  try {
    // Always log OTP for debugging purposes
    console.log('\n🔐 SENDGRID OTP DEBUG INFO 🔐');
    console.log('═══════════════════════════════════════');
    console.log(`📧 To: ${email}`);
    console.log(`👤 Name: ${firstName}`);
    console.log(`🔐 OTP: ${otp}`);
    console.log('⏰ Valid for: 10 minutes');
    console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
    console.log('📧 SendGrid API Key:', process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('📧 Email From:', process.env.EMAIL_FROM || 'Not set');
    console.log('═══════════════════════════════════════\n');

    // Check if SendGrid is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('🔥 SENDGRID NOT CONFIGURED - EMAIL NOT SENT 🔥');
      return { success: false, message: 'SendGrid API key not configured' };
    }

    if (!process.env.EMAIL_FROM) {
      console.log('🔥 EMAIL_FROM NOT SET - EMAIL NOT SENT 🔥');
      return { success: false, message: 'EMAIL_FROM not configured' };
    }

    console.log('📤 Preparing SendGrid email...');

    const msg = {
      to: email,
      from: {
        email: process.env.EMAIL_FROM,
        name: 'SoftGlow'
      },
      subject: 'Your SoftGlow Password Reset OTP',
      html: `
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
      `,
      text: `
Hello ${firstName || 'Valued Customer'},

Your SoftGlow password reset OTP is: ${otp}

This OTP is valid for 10 minutes. Please use it to reset your password.

If you didn't request this, please ignore this email.

- SoftGlow Team
      `.trim()
    };

    console.log('📧 Sending email via SendGrid...');
    console.log('📧 Email details:', {
      to: msg.to,
      from: msg.from,
      subject: msg.subject
    });

    const result = await sgMail.send(msg);
    
    console.log('✅ SendGrid email sent successfully!');
    console.log('📧 Message ID:', result[0].headers['x-message-id']);
    console.log('📧 Status Code:', result[0].statusCode);
    
    return { 
      success: true, 
      message: 'OTP email sent successfully via SendGrid',
      messageId: result[0].headers['x-message-id'],
      provider: 'SendGrid'
    };

  } catch (error) {
    console.error('\n❌ SENDGRID EMAIL SENDING FAILED ❌');
    console.error('═══════════════════════════════════════');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    console.error('Response Body:', error.response?.body);
    console.error('Full Error:', error);
    console.error('═══════════════════════════════════════\n');

    return { 
      success: false, 
      message: 'SendGrid email delivery failed - check logs',
      error: error.message,
      provider: 'SendGrid'
    };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail
};