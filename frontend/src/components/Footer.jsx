import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🕯️</span>
              <span className="text-2xl font-bold">SoftGlow</span>
            </div>
            <p className="text-gray-400 mb-4">
              Creating beautiful moments with premium candles since 2025.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Products</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Care</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/customer/login" className="hover:text-white transition-colors">My Account</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-400">
              <p>📍 Ranchi, Jharkhand</p>
              <p>📞 (+91) </p>
              <p>✉️ @gmail.com</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 SoftGlow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;