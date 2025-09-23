const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('\n🔍 GMAIL SMTP TROUBLESHOOTING TOOL 🔍');
console.log('═══════════════════════════════════════════════════════════════');

// Check environment variables
console.log('\n📋 ENVIRONMENT VARIABLES CHECK:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.log('\n❌ Missing required environment variables!');
  process.exit(1);
}

// Test different Gmail configurations
const configurations = [
  {
    name: 'Standard Gmail SMTP',
    config: {
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    }
  },
  {
    name: 'Gmail SMTP with explicit settings',
    config: {
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    }
  },
  {
    name: 'Gmail SMTP SSL (Port 465)',
    config: {
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    }
  }
];

async function testConfiguration(config) {
  console.log(`\n🧪 Testing: ${config.name}`);
  console.log('─'.repeat(50));
  
  try {
    const transporter = nodemailer.createTransport(config.config);
    
    // Test connection
    console.log('🔗 Testing connection...');
    await transporter.verify();
    console.log('✅ Connection successful!');
    
    // Test sending email
    console.log('📧 Sending test email...');
    const testEmail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: 'SoftGlow OTP Test - ' + new Date().toISOString(),
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">🧪 Gmail SMTP Test</h2>
          <p>This is a test email from SoftGlow backend.</p>
          <p><strong>Configuration:</strong> ${config.name}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <p>If you receive this email, the configuration is working! ✅</p>
        </div>
      `
    };
    
    const result = await transporter.sendMail(testEmail);
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', result.messageId);
    console.log('📧 Response:', result.response);
    
    return { success: true, config: config.name, messageId: result.messageId };
    
  } catch (error) {
    console.log('❌ Configuration failed!');
    console.log('Error Type:', error.name);
    console.log('Error Message:', error.message);
    console.log('Error Code:', error.code);
    
    return { success: false, config: config.name, error: error.message };
  }
}

async function runAllTests() {
  console.log('\n🚀 Starting Gmail SMTP tests...\n');
  
  const results = [];
  
  for (const config of configurations) {
    const result = await testConfiguration(config);
    results.push(result);
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Summary
  console.log('\n📊 TEST RESULTS SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════');
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  if (successful.length > 0) {
    console.log('\n✅ SUCCESSFUL CONFIGURATIONS:');
    successful.forEach(r => {
      console.log(`  • ${r.config} (Message ID: ${r.messageId})`);
    });
  }
  
  if (failed.length > 0) {
    console.log('\n❌ FAILED CONFIGURATIONS:');
    failed.forEach(r => {
      console.log(`  • ${r.config}: ${r.error}`);
    });
  }
  
  // Recommendations
  console.log('\n💡 RECOMMENDATIONS:');
  if (successful.length === 0) {
    console.log('❌ All configurations failed. Possible issues:');
    console.log('  1. Invalid Gmail App Password');
    console.log('  2. 2-Factor Authentication not enabled');
    console.log('  3. "Less secure app access" disabled');
    console.log('  4. Gmail account locked or suspended');
    console.log('  5. Network/firewall blocking SMTP');
    console.log('\n🔧 IMMEDIATE ACTIONS:');
    console.log('  1. Verify Gmail App Password: https://myaccount.google.com/apppasswords');
    console.log('  2. Enable 2FA: https://myaccount.google.com/security');
    console.log('  3. Check account status: https://myaccount.google.com/');
  } else {
    console.log('✅ At least one configuration works!');
    console.log('🔧 Update your emailService.js to use the working configuration.');
  }
  
  console.log('\n═══════════════════════════════════════════════════════════════');
}

// Run the tests
runAllTests().catch(console.error);