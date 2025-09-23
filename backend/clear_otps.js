const mongoose = require('mongoose');
require('dotenv').config();

const OTP = require('./models/OTP');

async function clearOTPs() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const result = await OTP.deleteMany({ email: 'aditya.netario@gmail.com' });
    console.log(`Deleted ${result.deletedCount} OTP records for aditya.netario@gmail.com`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

clearOTPs();