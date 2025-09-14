import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Import components
import Home from './components/Home';
import AllProducts from './components/AllProducts';
import Product from './components/Product';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';
import CancelReturnPolicy from './components/CancelReturnPolicy';
import AdminLogin from './Admin/AdminLogin';
import AdminSignup from './Admin/AdminSignup';
import AdminDashboard from './Admin/AdminDashboard';
import CustomerLogin from './Customer/CustomerLogin';
import CustomerSignup from './Customer/CustomerSignup';
import CustomerDashboard from './Customer/CustomerDashboard';
import OAuthSuccess from './Customer/OAuthSuccess';
import ProtectedRoute from './components/ProtectedRoute';

// Import Auth Context
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { FavoritesProvider } from './contexts/FavoritesContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <Router>
        <div className="App">
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<Home />} />
            
            {/* All Products Route */}
            <Route path="/all-products" element={<AllProducts />} />
            <Route path="/product/:id" element={<Product />} />
            
            {/* Static Pages */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/cancel-return-policy" element={<CancelReturnPolicy />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredUserType="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            {/* Customer Routes */}
            <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/signup" element={<CustomerSignup />} />
          <Route path="/customer/oauth-success" element={<OAuthSuccess />} />
            <Route path="/customer/dashboard" element={
              <ProtectedRoute requiredUserType="customer">
                <CustomerDashboard />
              </ProtectedRoute>
            } />
            
            {/* Fallback route */}
            <Route path="*" element={<Home />} />
          </Routes>
      </div>
          </Router>
        </FavoritesProvider>
      </CartProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
  </AuthProvider>
  );
}

export default App;
