# Image Loading Fix for Production Deployment

## 🚨 Problem
Images load correctly on localhost but fail to load when deployed to a real website.

## 🔍 Root Cause
The frontend `.env` file contains localhost URLs that only work in development:
```
VITE_API_URL=http://localhost:8827/api
VITE_BACKEND_URL=http://localhost:8827
```

When deployed to production, these localhost URLs are not accessible from the internet.

## ✅ Solution

### For Production Deployment (e.g., Render, Vercel, Netlify)

1. **Update Backend Environment Variables for CORS**

   **CRITICAL**: Set the `FRONTEND_URL` environment variable in your backend to allow cross-origin requests:
   ```
   FRONTEND_URL=https://your-frontend-app.onrender.com
   ```

2. **Update Frontend Environment Variables**
   Replace localhost URLs with your actual deployed backend URL:
   ```
   VITE_BACKEND_URL=https://your-backend-app.onrender.com
   ```
   
   Example for Render deployment:
   ```
   VITE_BACKEND_URL=https://softglow-backend.onrender.com
   ```

2. **Platform-Specific Instructions**

   **Backend (Render):**
    - Go to your backend service dashboard
    - Navigate to "Environment" tab
    - Add/Update: `FRONTEND_URL=https://your-frontend-app.onrender.com`
    - Redeploy the backend service

    **Frontend (Render):**
    - Go to your frontend service dashboard
    - Navigate to "Environment" tab
    - Add/Update: `VITE_BACKEND_URL=https://your-backend-app.onrender.com`
    - Redeploy the service
 
    **Frontend (Vercel):**
    - Go to Project Settings → Environment Variables
    - Add: `VITE_BACKEND_URL=https://your-backend-app.onrender.com`
    - Redeploy
 
    **Frontend (Netlify):**
    - Go to Site Settings → Environment Variables
    - Add: `VITE_BACKEND_URL=https://your-backend-app.onrender.com`
    - Redeploy

### Backend CORS Configuration

Ensure your backend allows requests from your frontend domain:

```javascript
// In backend/index.js
const corsOptions = {
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:5174',
        'https://your-frontend-app.onrender.com', // Add your frontend URL
        'https://your-custom-domain.com' // If using custom domain
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Type', 'Content-Length']
};
```

## 🧪 How to Test

### Local Testing (Development)
1. Keep `.env` with localhost URLs
2. Images should load via Vite proxy

### Production Testing
1. Deploy backend with proper CORS configuration
2. Deploy frontend with production `VITE_BACKEND_URL`
3. Test image loading on deployed site

## 🔧 Technical Details

The `imageUtils.js` function handles both environments:

- **Development**: Uses relative paths with Vite proxy
- **Production**: Constructs full URLs using `VITE_BACKEND_URL`

```javascript
if (import.meta.env.DEV) {
    return imagePath; // Vite proxy handles /uploads → backend
} else {
    // Production: use full backend URL
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    return `${backendUrl}${imagePath}`;
}
```

## Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] **CRITICAL**: Backend `FRONTEND_URL` environment variable set to production frontend domain
- [ ] Backend redeployed with CORS configuration
- [ ] Frontend `VITE_BACKEND_URL` updated to production backend URL
- [ ] Frontend redeployed with new environment variables
- [ ] Test image loading on production site
- [ ] Verify browser network tab shows correct image URLs

## Common Issues & Troubleshooting

1. **Forgetting to update environment variables** - Most common cause
2. **CORS not configured** - Backend blocks frontend requests
3. **Wrong URL format** - Incorrect protocol or malformed URL
4. **Not redeploying** - Changes don't take effect until redeploy
5. **Backend not restarted** - Environment variables not loaded

### Debugging Steps

1. **Check backend logs** for CORS configuration:
   ```
   FRONTEND_URL configured as: https://your-frontend-app.onrender.com
   CORS origins allowed: ["https://your-frontend-app.onrender.com", "http://localhost:3000"]
   ```

2. **Verify environment variables** are set in deployment platform
3. **Test CORS headers** using browser developer tools
4. **Ensure both services are redeployed** after environment variable changes

## 🔗 Example URLs

**Development:**
- Frontend: `http://localhost:5174`
- Backend: `http://localhost:8827`
- Images: `/uploads/image.jpg` (proxied by Vite)

**Production:**
- Frontend: `https://softglow-frontend.onrender.com`
- Backend: `https://softglow-backend.onrender.com`
- Images: `https://softglow-backend.onrender.com/uploads/image.jpg`

---

**Quick Fix:** Update `VITE_API_URL` to your deployed backend URL and redeploy your frontend!