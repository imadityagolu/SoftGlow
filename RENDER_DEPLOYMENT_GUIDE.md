# SoftGlow Deployment Guide for Render

## 🚀 Pre-Deployment Checklist

### Backend Deployment Preparation

1. **Environment Variables Setup**
   - Copy all variables from `.env.example`
   - Generate strong secrets for production
   - Update URLs to production domains

2. **Required Environment Variables for Render**
   ```
   NODE_ENV=production
   PORT=10000
   FRONTEND_URL=https://your-frontend-app.onrender.com
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your_64_character_cryptographically_secure_secret_here
   JWT_EXPIRES_IN=30d
   ADMIN_CODE=your_secure_admin_code
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   SESSION_SECRET=your_secure_session_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

### Frontend Deployment Preparation

1. **Environment Variables for Frontend**
   ```
   VITE_API_URL=https://your-backend-app.onrender.com/api
   ```

## 📋 Step-by-Step Deployment Instructions

### Step 1: Deploy Backend to Render

1. **Create New Web Service**
   - Go to Render Dashboard
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `SoftGlow`

2. **Configure Backend Service**
   ```
   Name: softglow-backend
   Environment: Node
   Region: Choose closest to your users
   Branch: main (or your production branch)
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

3. **Set Environment Variables**
   - Go to "Environment" tab
   - Add all variables from the list above
   - **IMPORTANT**: Generate new secrets, don't use development ones

4. **Advanced Settings**
   ```
   Auto-Deploy: Yes
   Health Check Path: /api/products
   ```

### Step 2: Deploy Frontend to Render

1. **Create Static Site**
   - Click "New" → "Static Site"
   - Connect same GitHub repository
   - Select the repository: `SoftGlow`

2. **Configure Frontend Service**
   ```
   Name: softglow-frontend
   Branch: main
   Root Directory: frontend
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Set Environment Variables**
   - Add `VITE_API_URL` with your backend URL
   - Example: `https://softglow-backend.onrender.com/api`

### Step 3: Update CORS Configuration

1. **Update Backend CORS Settings**
   After getting your frontend URL, update `backend/index.js`:
   ```javascript
   const corsOptions = {
       origin: [
           process.env.FRONTEND_URL,
           'https://your-frontend-app.onrender.com'
       ],
       methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
       credentials: true
   };
   ```

2. **Update Google OAuth Redirect URLs**
   - Go to Google Cloud Console
   - Update OAuth redirect URIs:
     - `https://your-backend-app.onrender.com/api/customer/auth/google/callback`

## 🔧 Production Optimizations

### Backend Optimizations

1. **Add Production Dependencies**
   ```bash
   npm install helmet express-rate-limit compression
   ```

2. **Update index.js for Production**
   ```javascript
   const helmet = require('helmet');
   const rateLimit = require('express-rate-limit');
   const compression = require('compression');

   // Security headers
   app.use(helmet());

   // Compression
   app.use(compression());

   // Rate limiting
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   app.use(limiter);

   // Update session config
   app.use(session({
     secret: process.env.SESSION_SECRET,
     resave: false,
     saveUninitialized: false,
     cookie: {
       secure: process.env.NODE_ENV === 'production',
       httpOnly: true,
       maxAge: 24 * 60 * 60 * 1000,
       sameSite: 'strict'
     }
   }));
   ```

### Frontend Optimizations

1. **Update Vite Config for Production**
   ```javascript
   export default defineConfig({
     plugins: [react(), tailwindcss()],
     server: {
       port: 5174
     },
     build: {
       outDir: 'dist',
       sourcemap: false,
       minify: 'terser',
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             router: ['react-router-dom']
           }
         }
       }
     }
   })
   ```

## 🔍 Post-Deployment Testing

### Backend Health Checks

1. **Test API Endpoints**
   ```bash
   # Test products endpoint
   curl https://your-backend-app.onrender.com/api/products

   # Test authentication
   curl -X POST https://your-backend-app.onrender.com/api/admin/auth/login \
        -H "Content-Type: application/json" \
        -d '{"email":"test@test.com","password":"test"}'
   ```

2. **Verify Database Connection**
   - Check Render logs for "MongoDB Atlas connected"
   - Test CRUD operations through frontend

### Frontend Verification

1. **Test All Pages**
   - Home page loads correctly
   - Product listings work
   - Authentication flows function
   - Admin dashboard accessible
   - Customer dashboard functional

2. **Test API Integration**
   - Login/logout works
   - Product CRUD operations
   - Cart functionality
   - Order placement
   - File uploads

## 🚨 Common Issues & Solutions

### Backend Issues

1. **Build Fails**
   - Check Node.js version compatibility
   - Verify all dependencies in package.json
   - Check for missing environment variables

2. **Database Connection Fails**
   - Verify MongoDB Atlas IP whitelist (add 0.0.0.0/0 for Render)
   - Check connection string format
   - Ensure database user has proper permissions

3. **CORS Errors**
   - Update CORS origins with actual deployed URLs
   - Ensure credentials: true is set
   - Check frontend is using correct API URL

### Frontend Issues

1. **Build Fails**
   - Check for missing environment variables
   - Verify all imports are correct
   - Check for TypeScript errors

2. **API Calls Fail**
   - Verify VITE_API_URL is correct
   - Check network tab for actual requests
   - Ensure backend CORS allows frontend domain

## 📊 Monitoring & Maintenance

### Set Up Monitoring

1. **Render Metrics**
   - Monitor CPU and memory usage
   - Check response times
   - Set up alerts for downtime

2. **Application Monitoring**
   - Implement logging (Winston/Morgan)
   - Monitor error rates
   - Track user activity

### Regular Maintenance

1. **Security Updates**
   - Update dependencies monthly
   - Rotate secrets quarterly
   - Monitor security advisories

2. **Performance Optimization**
   - Monitor database performance
   - Optimize slow queries
   - Review and update caching strategies

## 🔐 Security Considerations

1. **Secrets Management**
   - Never commit secrets to Git
   - Use Render's environment variables
   - Rotate secrets regularly

2. **Database Security**
   - Use MongoDB Atlas with IP restrictions
   - Enable database authentication
   - Regular backups

3. **Application Security**
   - Keep dependencies updated
   - Monitor for vulnerabilities
   - Implement proper error handling

---

## 📞 Support

If you encounter issues during deployment:
1. Check Render logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test API endpoints individually
4. Check database connectivity
5. Review CORS configuration

**Estimated Deployment Time**: 30-45 minutes
**Free Tier Limitations**: Render free tier has sleep mode after 15 minutes of inactivity