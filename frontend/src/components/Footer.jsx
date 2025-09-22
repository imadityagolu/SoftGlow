import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/logo.png';

const Footer = () => {
  return (
    <footer id="contact" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-start mb-4">
              <img src={logoImage} alt="Logo" className="h-10 w-10 mr-3 rounded-full object-cover border-2 border-gray-600" />
              <span className="text-2xl font-bold">{import.meta.env.VITE_COMPANY_NAME}</span>
            </div>
            <p className="text-gray-400 mb-4">
              {import.meta.env.VITE_COMPANY_DESC}
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
              <p className="hover:text-white transition-colors">📍 {import.meta.env.VITE_LOCATION}</p>
              <p><a href={`https://api.whatsapp.com/send?phone=91${import.meta.env.VITE_PHONE}`} target='_blank' className="hover:text-white transition-colors">📲 {import.meta.env.VITE_PHONE}</a></p>
              <p><a href={`mailto:${import.meta.env.VITE_EMAIL}`} className="hover:text-white transition-colors">📬 {import.meta.env.VITE_EMAIL}</a></p>
              <p><a href={`https://www.instagram.com/${import.meta.env.VITE_INSTA_LINK}`} target='_blank' className="hover:text-white transition-colors">🔗 {import.meta.env.VITE_INSTA_LINK}</a></p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-center items-center text-gray-400">
            <p className="text-sm mb-4 md:mb-0">&copy; 2025 {import.meta.env.VITE_COMPANY_NAME}. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;