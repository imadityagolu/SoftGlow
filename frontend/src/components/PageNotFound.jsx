import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Header />
      
      <div className="flex items-center justify-center min-h-screen px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-orange-200 mb-4">404</div>
            <div className="text-6xl mb-6">🕯️</div>
          </div>
          
          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">
              Oops! Page Not Found
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              The page you're looking for seems to have blown out like a candle in the wind.
            </p>
            <p className="text-gray-500">
              Don't worry, let's help you find your way back to our beautiful collection.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link 
              to="/"
              className="bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🏠 Go Home
            </Link>
            
            <Link 
              to="/all-products"
              className="bg-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              🛍️ Shop Candles
            </Link>
            
            <button 
              onClick={handleGoBack}
              className="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-orange-600 hover:text-white transition-colors"
            >
              ← Go Back
            </button>
          </div>
          
          {/* Quick Links */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Popular Pages
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                to="/about"
                className="text-orange-600 hover:text-orange-700 transition-colors p-2 rounded-lg hover:bg-orange-50"
              >
                About Us
              </Link>
              <Link 
                to="/contact"
                className="text-orange-600 hover:text-orange-700 transition-colors p-2 rounded-lg hover:bg-orange-50"
              >
                Contact
              </Link>
              <Link 
                to="/customer/login"
                className="text-orange-600 hover:text-orange-700 transition-colors p-2 rounded-lg hover:bg-orange-50"
              >
                Login
              </Link>
              <Link 
                to="/customer/signup"
                className="text-orange-600 hover:text-orange-700 transition-colors p-2 rounded-lg hover:bg-orange-50"
              >
                Sign Up
              </Link>
            </div>
          </div>
          
          {/* Search Suggestion */}
          <div className="mt-8 text-gray-500">
            <p className="text-sm">
              Looking for something specific? Try searching from our{' '}
              <Link to="/" className="text-orange-600 hover:text-orange-700 underline">
                homepage
              </Link>
              {' '}or browse our{' '}
              <Link to="/all-products" className="text-orange-600 hover:text-orange-700 underline">
                complete collection
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PageNotFound;