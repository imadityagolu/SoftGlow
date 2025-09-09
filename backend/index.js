const express = require('express');
const app = express();
require("dotenv/config");
const cors = require('cors');
const mongoose = require("mongoose");
const path = require('path');

const adminAuthRoutes = require('./routes/adminAuth');
const customerAuthRoutes = require('./routes/customerAuth');
const productRoutes = require('./routes/product');
const customerRoutes = require('./routes/customer');
const uploadRoutes = require('./routes/upload');
const cartRoutes = require('./routes/cart');

// Increase payload limit for image uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

//cors
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
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
app.use("/api/upload", uploadRoutes);
app.use("/api/cart", cartRoutes);

//starting server
app.listen(process.env.PORT, () => console.log(`server - http://localhost:${process.env.PORT}`));