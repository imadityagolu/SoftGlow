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

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http://localhost:5174"],
    },
  },
}));

// Compression middleware
app.use(compression());

// Rate limiting - more permissive for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 1000 for dev, 100 for production
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for static files and uploads
    return req.path.startsWith('/uploads/');
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

//cors
const corsOptions = {
    origin: [process.env.FRONTEND_URL || 'http://localhost:5174', 'http://localhost:3000'],
    methods:["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
};
app.use(cors(corsOptions));

 //mongoose
mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Atlas connected"))
.catch((error) => console.error(error));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

//starting server
app.listen(process.env.PORT, () => console.log(`server - http://localhost:${process.env.PORT}`));