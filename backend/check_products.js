require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log('Connected to MongoDB');
    const products = await Product.find().limit(5);
    console.log('Products found:', products.length);
    
    if (products.length > 0) {
      console.log('First product:', JSON.stringify(products[0], null, 2));
    } else {
      console.log('No products found in database');
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });