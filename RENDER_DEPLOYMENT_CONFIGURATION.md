# Render Deployment Configuration Guide

## 🚀 Backend Deployment (Render Web Service)

### Environment Variables to Set on Render:

```bash
# Server Configuration
PORT=8827
NODE_ENV=production

# Frontend URL - UPDATE WITH YOUR ACTUAL FRONTEND URL
FRONTEND_URL=https://your-frontend.onrender.com
PRODUCTION_FRONTEND_URL=https://your-frontend.onrender.com

# Database
MONGO_URL=mongodb+srv://adityasng420ak:aditya12345@cluster0.fgxyhi8.mongodb.net/Softglow
MONGODB_URI=mongodb+srv://adityasng420ak:aditya12345@cluster0.fgxyhi8.mongodb.net/Softglow

# JWT Configuration
JWT_SECRET=SOFTGLOW2025
JWT_EXPIRES_IN=30d

# Admin Configuration
ADMIN_CODE=ADITYA

# Google OAuth Configuration
GOOGLE_CLIENT_ID=257230204047-190tfce8cvui76j7rqb4pov76mmc6cii.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
SESSION_SECRET=SOFTGLOW2025_OAUTH_SESSION_SECRET_KEY

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=adityasng420.ak@gmail.com
EMAIL_PASS=lcyh pshl lgeo gymy
EMAIL_FROM=SoftGlow <adityasng420.ak@gmail.com>

# Razorpay Configuration
RAZORPAY_KEY_ID=rzp_live_RFxhiUznuC87vm
RAZORPAY_KEY_SECRET=RT0s1TfPq5B0M6zZ1RUhREdF

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dwdkkuph0
CLOUDINARY_API_KEY=836726272221512
CLOUDINARY_API_SECRET=DBDBKW8NViBVbdSkbpkWSZ3cOYY
```

## 🌐 Frontend Deployment (Render Static Site)

### Environment Variables to Set on Render:

```bash
# Backend API URL - UPDATE WITH YOUR ACTUAL BACKEND URL
VITE_BACKEND_URL=https://your-backend.onrender.com

# Company Details
VITE_COMPANY_NAME=Softglow Candles
VITE_COMPANY_DESC=Creating beautiful moments with premium candles since 2025.
VITE_EMAIL=adityasng420.ak@gmail.com
VITE_PHONE=8083079692
VITE_INSTA_LINK=_.softglow
VITE_LOCATION=Ranchi, Jharkhand.
```

## 📋 Deployment Steps:

### 1. Backend Deployment:
1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Set **Root Directory** to `backend`
4. Set **Build Command** to `npm install`
5. Set **Start Command** to `npm start`
6. Add all the backend environment variables listed above
7. **IMPORTANT**: Update `FRONTEND_URL` and `PRODUCTION_FRONTEND_URL` with your actual frontend URL

### 2. Frontend Deployment:
1. Create a new **Static Site** on Render
2. Connect your GitHub repository
3. Set **Root Directory** to `frontend`
4. Set **Build Command** to `npm install && npm run build`
5. Set **Publish Directory** to `dist`
6. Add all the frontend environment variables listed above
7. **IMPORTANT**: Update `VITE_BACKEND_URL` and `VITE_API_URL` with your actual backend URL

### 3. Update URLs:
After both services are deployed:
1. Copy the backend URL (e.g., `https://softglow-backend.onrender.com`)
2. Update frontend environment variables:
   - `VITE_BACKEND_URL=https://softglow-backend.onrender.com`
3. Copy the frontend URL (e.g., `https://softglow-frontend.onrender.com`)
4. Update backend environment variables:
   - `FRONTEND_URL=https://softglow-frontend.onrender.com`
   - `PRODUCTION_FRONTEND_URL=https://softglow-frontend.onrender.com`
5. Redeploy both services

## 🔧 Common Issues & Solutions:

### CORS Errors:
- Ensure `FRONTEND_URL` in backend matches your frontend URL exactly
- Check that both HTTP and HTTPS protocols match

### API Connection Issues:
- Verify `VITE_BACKEND_URL` in frontend points to correct backend URL
- Ensure backend is running and accessible

### Email Issues:
- Gmail App Password might need to be regenerated
- Check if Gmail account has 2FA enabled

### Database Connection:
- Verify MongoDB Atlas allows connections from all IPs (0.0.0.0/0)
- Check if database credentials are correct

## 🔍 Testing Deployment:

1. **Backend Health Check**: Visit `https://your-backend.onrender.com/api/products`
2. **Frontend Loading**: Visit your frontend URL
3. **API Communication**: Try login/register functionality
4. **CORS Verification**: Check browser console for CORS errors

## 📝 Notes:

- Render free tier may have cold starts (services sleep after inactivity)
- First request after sleep may take 30-60 seconds
- Consider upgrading to paid tier for production use
- Monitor logs in Render dashboard for debugging

## 🔐 Security Recommendations:

1. **Regenerate Secrets**: Create new JWT_SECRET and SESSION_SECRET for production
2. **Database Security**: Use separate production database
3. **API Keys**: Verify all API keys are for production use
4. **CORS**: Restrict CORS to only your frontend domain in production