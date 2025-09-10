const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Customer = require('../models/Customer');

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/customer/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if customer already exists with this Google ID
    let customer = await Customer.findOne({ googleId: profile.id });
    
    if (customer) {
      // Customer exists, return the customer
      return done(null, customer);
    }
    
    // Check if customer exists with the same email
    customer = await Customer.findOne({ email: profile.emails[0].value });
    
    if (customer) {
      // Link Google account to existing customer
      customer.googleId = profile.id;
      customer.authProvider = 'google';
      customer.isEmailVerified = true;
      await customer.save();
      return done(null, customer);
    }
    
    // Create new customer
    const newCustomer = new Customer({
      googleId: profile.id,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      email: profile.emails[0].value,
      phone: '', // Will need to be filled later
      authProvider: 'google',
      isEmailVerified: true
    });
    
    await newCustomer.save();
    return done(null, newCustomer);
    
  } catch (error) {
    console.error('Google OAuth error:', error);
    return done(error, null);
  }
}));

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const customer = await Customer.findById(id);
    done(null, customer);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;