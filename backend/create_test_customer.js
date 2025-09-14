const mongoose = require('mongoose');
require('dotenv/config');
const Customer = require('./models/Customer');

async function createTestCustomer() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    // Check if test customer already exists
    const existingCustomer = await Customer.findOne({ email: 'test@example.com' });
    if (existingCustomer) {
      console.log('Test customer already exists');
      console.log('Email: test@example.com');
      console.log('Password: testpassword123');
      process.exit(0);
    }
    
    // Create test customer
    const testCustomer = await Customer.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'testpassword123',
      authProvider: 'local',
      isActive: true
    });
    
    console.log('Test customer created successfully!');
    console.log('Email: test@example.com');
    console.log('Password: testpassword123');
    console.log('Customer ID:', testCustomer._id);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createTestCustomer();