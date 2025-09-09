import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Header = () => {
  const { isAuthenticated, isCustomer, logout, user } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/customer/dashboard');
  };

  const handleCartClick = () => {
    if (isAuthenticated() && isCustomer()) {
      navigate('/customer/dashboard?tab=cart');
    } else {
      navigate('/customer/login');
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <span className="text-3xl mr-3">🕯️</span>
            <span className="text-2xl font-bold text-gray-900">SoftGlow</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-amber-600 font-medium">Home</a>
            <a href="#about" className="text-gray-700 hover:text-amber-600 transition-colors">About us</a>
            <a href="#products" className="text-gray-700 hover:text-amber-600 transition-colors">Special candles</a>
            <a href="#contact" className="text-gray-700 hover:text-amber-600 transition-colors">Contact</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={handleCartClick}
              className="p-2 text-gray-700 hover:text-amber-600 transition-colors relative"
            >
              🛒
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>
            {isAuthenticated() && isCustomer() ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleProfileClick}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2"
                >
                  <span>👤</span>
                  <span>{user?.firstName || 'Profile'}</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/customer/login"
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;