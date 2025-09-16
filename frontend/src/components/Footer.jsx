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
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/all-products" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/customer/dashboard" className="hover:text-white transition-colors">My Account</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Customer Care</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/cancel-return-policy" className="hover:text-white transition-colors">Cancel, Return & Refund</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Info</h3>
            <div className="space-y-2 text-gray-400">
              <p className="hover:text-white transition-colors">📍 Ranchi, Jharkhand</p>
              <p><a href="https://api.whatsapp.com/send?phone=918083079692" target='_blank' className="hover:text-white transition-colors">📲 WhatsApp</a></p>
              <p><a href="mailto:adityasng420.ak@gmail.com" className="hover:text-white transition-colors">📬 softglow@gmail.com</a></p>
              <p><a href="https://www.instagram.com/_.softglow/" target='_blank' className="hover:text-white transition-colors">🔗 follow us</a></p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center text-gray-400">
            <p className="text-sm mb-4 md:mb-0">&copy; 2025 SoftGlow. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;