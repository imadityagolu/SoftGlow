// Import the unified email service with Gmail + SendGrid fallback
const unifiedEmailService = require('./unifiedEmailService');

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email using unified service with automatic fallback
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
    console.log('🔑 SendGrid Key:', process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('═══════════════════════════════════════\n');

    // Use unified email service with automatic fallback
    const result = await unifiedEmailService.sendOTPEmail(email, otp, firstName);
    
    if (result.success) {
      console.log('✅ Email sent successfully via:', result.provider);
      console.log('📧 Message ID:', result.messageId);
      return { success: true, message: `OTP email sent successfully via ${result.provider}` };
    } else {
      console.error('❌ All email providers failed:', result.error);
      // Return success even if email fails to prevent blocking the OTP process
      console.log('⚠️ Email failed but OTP is still valid for password reset');
      return { success: true, message: 'OTP generated (email delivery failed - check logs)' };
    }
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
    console.log('⚠️ Email failed but OTP is still valid for password reset');
    return { success: true, message: 'OTP generated (email delivery failed - check logs)' };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail
};