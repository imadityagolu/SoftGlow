const { sendOTPEmail } = require('./utils/emailService');
require('dotenv').config();

// Test email service configuration
async function testEmailService() {
  console.log('🧪 Testing Email Service Configuration...\n');
  
  // Check environment variables
  console.log('📧 Email Configuration:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
  console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log('');
  
  // Test sending OTP
  try {
    console.log('📤 Attempting to send test OTP...');
    const result = await sendOTPEmail(
      'test@example.com', 
      '123456', 
      'Test User'
    );
    
    console.log('✅ Email service test result:', result);
    
    if (result.emailFailed) {
      console.log('⚠️ Email sending failed but OTP would still be logged');
      console.log('🔧 This means users can still reset passwords using console OTP');
    } else {
      console.log('🎉 Email service is working correctly!');
    }
    
  } catch (error) {
    console.error('❌ Email service test failed:', error.message);
    console.log('🔧 Possible solutions:');
    console.log('   1. Check EMAIL_USER and EMAIL_PASS environment variables');
    console.log('   2. Verify Gmail app password is correct');
    console.log('   3. Ensure 2FA is enabled on Gmail account');
    console.log('   4. Check if Gmail is blocking the connection');
  }
}

// Run the test
testEmailService().then(() => {
  console.log('\n🏁 Email service test completed');
  process.exit(0);
}).catch((error) => {
  console.error('💥 Test script error:', error);
  process.exit(1);
});