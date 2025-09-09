import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import components
import Home from './components/Home';
import AdminLogin from './Admin/AdminLogin';
import AdminSignup from './Admin/AdminSignup';
import AdminDashboard from './Admin/AdminDashboard';
import CustomerLogin from './Customer/CustomerLogin';
import CustomerSignup from './Customer/CustomerSignup';
import CustomerDashboard from './Customer/CustomerDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<Home />} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          
          {/* Customer Routes */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/signup" element={<CustomerSignup />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          
          {/* Fallback route */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
