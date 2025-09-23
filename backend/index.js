const express = require('express');
const app = express();
require("dotenv/config");
const cors = require('cors');
const mongoose = require("mongoose");
const path = require('path');
const session = require('express-session');
const passport = require('./config/passport');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

const adminAuthRoutes = require('./routes/adminAuth');
const customerAuthRoutes = require('./routes/customerAuth');
const productRoutes = require('./routes/product');
const customerRoutes = require('./routes/customer');
const uploadRoutes = require('./routes/upload');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const notificationRoutes = require('./routes/notification');
const favoriteRoutes = require('./routes/favorite');
const adminStatsRoutes = require('./routes/adminStats');
const contactRoutes = require('./routes/contact');
const feedbackRoutes = require('./routes/feedback');
const diagnosticRoutes = require('./routes/diagnostic');

// CORS configuration - MUST be first to handle preflight requests
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            process.env.FRONTEND_URL,
            'http://localhost:5173',
            'http://localhost:5174',
            'http://localhost:3000',
            // Add your production frontend URLs here
            process.env.PRODUCTION_FRONTEND_URL,
            // Common Render/Netlify/Vercel patterns
            /^https:\/\/.*\.onrender\.com$/,
            /^https:\/\/.*\.netlify\.app$/,
            /^https:\/\/.*\.vercel\.app$/,
            /^https:\/\/.*\.herokuapp\.com$/
        ].filter(Boolean); // Remove undefined values
        
        // Check if origin matches any allowed pattern
        const isAllowed = allowedOrigins.some(allowedOrigin => {
            if (typeof allowedOrigin === 'string') {
                return origin === allowedOrigin;
            } else if (allowedOrigin instanceof RegExp) {
                return allowedOrigin.test(origin);
            }
            return false;
        });
        
        if (isAllowed) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods:["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Type', 'Content-Length']
};
app.use(cors(corsOptions));

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false, // Temporarily disable CSP to test image loading
}));

// Compression middleware
app.use(compression());

// Rate limiting - more lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // increased limit for development
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for auth routes during development
    return req.path.includes('/auth/') || process.env.NODE_ENV !== 'production';
  }
});
app.use(limiter);

// Increase payload limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Session configuration for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax'
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// CORS already configured at the top of the file

 //mongoose
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Atlas connected"))
.catch((error) => console.error(error));

// Handle preflight requests for uploads
app.options('/uploads/*', cors(corsOptions));

// Serve static files from uploads directory with enhanced CORS
app.use('/uploads', (req, res, next) => {
  // Set CORS headers explicitly for static files
  const origin = req.headers.origin;
  
  if (origin) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      process.env.PRODUCTION_FRONTEND_URL,
    ].filter(Boolean);
    
    const allowedPatterns = [
      /^https:\/\/.*\.onrender\.com$/,
      /^https:\/\/.*\.netlify\.app$/,
      /^https:\/\/.*\.vercel\.app$/,
      /^https:\/\/.*\.herokuapp\.com$/
    ];
    
    const isAllowed = allowedOrigins.includes(origin) || 
                     allowedPatterns.some(pattern => pattern.test(origin));
    
    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  next();
}, express.static(path.join(__dirname, 'uploads')));


//api
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/customer/auth", customerAuthRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin/customers", customerRoutes);
app.use("/api/admin/stats", adminStatsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/diagnostic", diagnosticRoutes);

//starting server
const PORT = process.env.PORT || 8827;
app.listen(PORT, () => console.log(`server - http://localhost:${PORT}`));