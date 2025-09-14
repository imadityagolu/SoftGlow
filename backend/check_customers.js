const mongoose = require('mongoose');
require('dotenv/config');
const Customer = require('./models/Customer');

async function checkCustomers() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');
    
    const customers = await Customer.find({}).select('+password');
    console.log('Customers found:', customers.length);
    
    if (customers.length > 0) {
      console.log('First customer:', {
        email: customers[0].email,
        firstName: customers[0].firstName,
        lastName: customers[0].lastName,
        hasPassword: !!customers[0].password,
        isActive: customers[0].isActive,
        authProvider: customers[0].authProvider
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkCustomers();