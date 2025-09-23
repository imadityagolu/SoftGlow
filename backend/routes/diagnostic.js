const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Diagnostic endpoint for email testing
router.get('/email-test', async (req, res) => {
  try {
    console.log('\n🔍 EMAIL DIAGNOSTIC STARTED 🔍');
    console.log('═══════════════════════════════════════');
    
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      emailConfig: {
        EMAIL_USER: process.env.EMAIL_USER ? '✅ Set' : '❌ Missing',
        EMAIL_PASS: process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing',
        EMAIL_HOST: process.env.EMAIL_HOST || 'Not set',
        EMAIL_PORT: process.env.EMAIL_PORT || 'Not set',
        EMAIL_FROM: process.env.EMAIL_FROM || 'Not set'
      },
      tests: []
    };
    
    // Test 1: Environment variables
    console.log('📋 Testing environment variables...');
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      diagnostics.tests.push({
        test: 'Environment Variables',
        status: 'FAILED',
        error: 'Missing EMAIL_USER or EMAIL_PASS'
      });
      return res.json(diagnostics);
    }
    
    diagnostics.tests.push({
      test: 'Environment Variables',
      status: 'PASSED'
    });
    
    // Test 2: Create transporter
    console.log('🔧 Creating Gmail transporter...');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Test 3: Verify connection
    console.log('🔗 Testing SMTP connection...');
    try {
      await transporter.verify();
      diagnostics.tests.push({
        test: 'SMTP Connection',
        status: 'PASSED'
      });
      console.log('✅ SMTP connection verified!');
    } catch (error) {
      diagnostics.tests.push({
        test: 'SMTP Connection',
        status: 'FAILED',
        error: error.message,
        code: error.code
      });
      console.log('❌ SMTP connection failed:', error.message);
      return res.json(diagnostics);
    }
    
    // Test 4: Send test email (optional, only if testEmail query param is provided)
    if (req.query.testEmail) {
      console.log('📧 Sending test email...');
      try {
        const testEmail = {
          from: process.env.EMAIL_USER,
          to: req.query.testEmail,
          subject: 'SoftGlow Production Email Test - ' + new Date().toISOString(),
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">🧪 Production Email Test</h2>
              <p>This is a test email from SoftGlow production backend.</p>
              <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Server:</strong> Render Production</p>
              <p>If you receive this email, the email service is working! ✅</p>
            </div>
          `
        };
        
        const result = await transporter.sendMail(testEmail);
        diagnostics.tests.push({
          test: 'Send Test Email',
          status: 'PASSED',
          messageId: result.messageId,
          response: result.response
        });
        console.log('✅ Test email sent successfully!');
      } catch (error) {
        diagnostics.tests.push({
          test: 'Send Test Email',
          status: 'FAILED',
          error: error.message,
          code: error.code
        });
        console.log('❌ Test email failed:', error.message);
      }
    }
    
    console.log('═══════════════════════════════════════\n');
    res.json(diagnostics);
    
  } catch (error) {
    console.error('❌ Diagnostic error:', error);
    res.status(500).json({
      error: 'Diagnostic failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Quick OTP test endpoint
router.post('/test-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    
    console.log('\n🧪 TESTING OTP EMAIL SEND 🧪');
    console.log('═══════════════════════════════════════');
    console.log('📧 Test email:', email);
    
    // Import and use the actual email service
    const { sendOTPEmail } = require('../utils/emailService');
    const testOTP = '123456';
    
    const result = await sendOTPEmail(email, testOTP, 'Test User');
    
    console.log('📊 Result:', result);
    console.log('═══════════════════════════════════════\n');
    
    res.json({
      success: true,
      message: 'OTP test completed',
      result: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ OTP test error:', error);
    res.status(500).json({
      error: 'OTP test failed',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;