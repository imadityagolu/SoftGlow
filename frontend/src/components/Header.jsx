import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import logoImage from '../assets/logo.png';

const Header = () => {
  const { isAuthenticated, isCustomer, logout, user } = useAuth();
  const { cartItemCount } = useCart();
  const { favoritesCount } = useFavorites();
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

  const handleFavoritesClick = () => {
    if (isAuthenticated() && isCustomer()) {
      navigate('/customer/dashboard?tab=favorites');
    } else {
      navigate('/customer/login');
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <img src={logoImage} alt="Logo" className="h-8 w-8 mr-2" />
            <span className="text-xl font-bold text-gray-900">{import.meta.env.VITE_COMPANY_NAME}</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-amber-600 font-medium">Home</Link>
            <a href="#products" className="text-gray-700 hover:text-amber-600 transition-colors">Special candles</a>
            <Link to="/all-products" className="text-gray-700 hover:text-amber-600 transition-colors">All products</Link>
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handleFavoritesClick}
              className="p-2 text-gray-700 hover:text-amber-600 transition-colors relative cursor-pointer"
            >
              ❤️
              {favoritesCount > 0 && (
                <span className="absolute -top-0 -right-1 bg-red-500 text-white text-sm rounded-full h-4 w-4 flex items-center justify-center">
                  {favoritesCount > 99 ? '99+' : favoritesCount}
                </span>
              )}
            </button>
            <button 
              onClick={handleCartClick}
              className="p-2 pr-4 text-gray-700 hover:text-amber-600 transition-colors relative cursor-pointer"
            >
              🛒
              {cartItemCount > 0 && (
                <span className="absolute -top-0 -right-0 bg-amber-500 text-white text-sm rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>
            {isAuthenticated() && isCustomer() ? (
              <div className="flex items-center space-x-2 cursor-pointer">
                <button
                  onClick={handleProfileClick}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center space-x-2 cursor-pointer"
                >
                  <span>👤</span>
                  <span>{user?.firstName || 'Profile'}</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/customer/login"
                className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors cursor-pointer"
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