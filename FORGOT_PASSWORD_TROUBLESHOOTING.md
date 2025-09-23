# 🔐 Forget Password Deployment Troubleshooting Guide

## 🚨 Issue: Forget Password Not Working in Production

### ✅ **Verified Working Components:**
- ✅ Frontend implementation (`ForgotPassword.jsx`)
- ✅ Backend routes (`/api/customer/auth/forgot-password`)
- ✅ Email service (tested locally - working)
- ✅ CORS configuration (updated for production)
- ✅ API URL structure (simplified to use only `VITE_BACKEND_URL`)

### 🔍 **Most Likely Causes & Solutions:**

## 1. **Environment Variables Missing on Render** ⚙️

### **Check These Variables on Render Backend:**
```bash
EMAIL_USER=adityasng420.ak@gmail.com
EMAIL_PASS=lcyh pshl lgeo gymy
```

### **How to Fix:**
1. Go to your Render backend service dashboard
2. Navigate to "Environment" tab
3. Ensure both `EMAIL_USER` and `EMAIL_PASS` are set
4. Redeploy if variables were missing

## 2. **Frontend API URL Configuration** 🌐

### **Check Frontend Environment Variable:**
```bash
# On Render Frontend Static Site
VITE_BACKEND_URL=https://your-backend-service.onrender.com
```

### **How to Fix:**
1. Go to your Render frontend service dashboard
2. Navigate to "Environment" tab
3. Set `VITE_BACKEND_URL` to your actual backend URL
4. Redeploy frontend

## 3. **Gmail Security Blocking Production** 📧

### **Symptoms:**
- Works locally but fails in production
- Backend logs show email sending errors

### **Solutions:**
1. **Enable 2-Factor Authentication** on Gmail account
2. **Generate New App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate new password for "Mail"
   - Update `EMAIL_PASS` on Render

3. **Alternative: Use Different Email Service**
   ```javascript
   // In emailService.js, replace Gmail with SendGrid/Mailgun
   const transporter = nodemailer.createTransporter({
     service: 'SendGrid', // or other service
     auth: {
       user: process.env.SENDGRID_USERNAME,
       pass: process.env.SENDGRID_PASSWORD
     }
   });
   ```

## 4. **Network/Firewall Issues** 🔥

### **Render-Specific Issues:**
- Render might block certain SMTP connections
- Gmail SMTP might be rate-limited

### **Solutions:**
1. **Check Render Logs:**
   ```bash
   # Look for these in backend logs:
   "Email sending error"
   "SMTP connection failed"
   "Authentication failed"
   ```

2. **Use Render-Friendly Email Service:**
   - SendGrid (recommended for Render)
   - Mailgun
   - AWS SES

## 🛠️ **Debugging Steps:**

### **Step 1: Check Backend Logs**
1. Go to Render backend service
2. Check "Logs" tab
3. Look for OTP debug output:
   ```
   🔐 OTP DEBUG INFO 🔐
   📧 To: user@example.com
   🔐 OTP: 123456
   ```

### **Step 2: Test API Endpoints**
```bash
# Test forgot password endpoint
curl -X POST https://your-backend.onrender.com/api/customer/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### **Step 3: Check Network Tab**
1. Open browser DevTools
2. Go to Network tab
3. Try forgot password
4. Check for:
   - CORS errors
   - 404 errors (wrong API URL)
   - 500 errors (server issues)

## 🚀 **Quick Fixes:**

### **Fix 1: Update Email Service to SendGrid**
```javascript
// Install: npm install @sendgrid/mail
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOTPEmail = async (email, otp, firstName) => {
  const msg = {
    to: email,
    from: process.env.EMAIL_FROM,
    subject: 'Password Reset OTP - SoftGlow Candles',
    html: `Your OTP is: ${otp}`
  };
  
  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: true, emailFailed: true };
  }
};
```

### **Fix 2: Add Fallback Email Service**
```javascript
// In emailService.js
const sendOTPEmail = async (email, otp, firstName) => {
  try {
    // Try Gmail first
    const result = await sendWithGmail(email, otp, firstName);
    return result;
  } catch (error) {
    console.log('Gmail failed, trying SendGrid...');
    // Fallback to SendGrid
    return await sendWithSendGrid(email, otp, firstName);
  }
};
```

## 📋 **Deployment Checklist:**

- [ ] Backend environment variables set on Render
- [ ] Frontend `VITE_BACKEND_URL` points to correct backend
- [ ] Gmail 2FA enabled and app password generated
- [ ] CORS allows your frontend domain
- [ ] Backend logs show OTP generation
- [ ] Test API endpoints directly

## 🆘 **Emergency Workaround:**

If email is completely broken, users can still reset passwords:

1. **Check Backend Logs** for OTP output
2. **Manually provide OTP** to users via support
3. **Implement SMS OTP** as backup
4. **Use Console OTP** (logged in development mode)

## 📞 **Next Steps:**

1. **Check Render environment variables first**
2. **Review backend logs for email errors**
3. **Test API endpoints directly**
4. **Consider switching to SendGrid for production**

---

**Note:** The forget password system is designed to work even if email fails - OTPs are always logged to console for debugging purposes.