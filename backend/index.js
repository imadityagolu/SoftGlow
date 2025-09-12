const express = require('express');
const app = express();
require("dotenv/config");
const cors = require('cors');
const mongoose = require("mongoose");
const path = require('path');
const session = require('express-session');
const passport = require('./config/passport');

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

// Increase payload limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Session configuration for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
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

//starting server
app.listen(process.env.PORT, () => console.log(`server - http://localhost:${process.env.PORT}`));