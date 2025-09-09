import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import Home from './components/Home';
import AllProducts from './components/AllProducts';
import Product from './components/Product';
import AdminLogin from './Admin/AdminLogin';
import AdminSignup from './Admin/AdminSignup';
import AdminDashboard from './Admin/AdminDashboard';
import CustomerLogin from './Customer/CustomerLogin';
import CustomerSignup from './Customer/CustomerSignup';
import CustomerDashboard from './Customer/CustomerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Import Auth Context
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
        <div className="App">
          <Routes>
            {/* Home Route */}
            <Route path="/" element={<Home />} />
            
            {/* All Products Route */}
            <Route path="/all-products" element={<AllProducts />} />
            <Route path="/product/:id" element={<Product />} />
            
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
      </CartProvider>
  </AuthProvider>
  );
}

export default App;
