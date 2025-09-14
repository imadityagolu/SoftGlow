require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGO_URL)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Get all products (including inactive)
    const allProducts = await Product.find();
    console.log('Total products found:', allProducts.length);
    
    // Get only active products
    const activeProducts = await Product.find({ isActive: true });
    console.log('Active products found:', activeProducts.length);
    
    // Get inactive products
    const inactiveProducts = await Product.find({ isActive: false });
    console.log('Inactive products found:', inactiveProducts.length);
    
    // Show all product names and status
    console.log('\nAll products:');
    allProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - Active: ${product.isActive}`);
    });
    
    if (allProducts.length > 0) {
      console.log('\nFirst product details:', JSON.stringify(allProducts[0], null, 2));
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });