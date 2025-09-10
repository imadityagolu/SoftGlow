import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const OAuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userString = searchParams.get('user');
    
    // Debug logging
    console.log('OAuth Success - Current URL:', window.location.href);
    console.log('OAuth Success - Token:', token);
    console.log('OAuth Success - User String:', userString);
    console.log('OAuth Success - All URL params:', Object.fromEntries(searchParams));

    if (token && userString) {
      try {
        const user = JSON.parse(decodeURIComponent(userString));
        
        // Login the user
        login(user, token, 'customer');
        
        // Redirect to home page
        navigate('/');
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/customer/login?error=oauth_parse_failed');
      }
    } else {
      console.log('OAuth Success - Missing token or user data, redirecting to login');
      // If no token or user data, redirect immediately
      setTimeout(() => {
        navigate('/customer/login?error=oauth_missing_data');
      }, 1000); // Give a brief moment to show the loading state
    }
  }, [searchParams, login, navigate]);

  const token = searchParams.get('token');
  const userString = searchParams.get('user');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {token && userString ? 'Completing Sign In...' : 'Redirecting...'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {token && userString 
              ? 'Please wait while we complete your Google sign in.'
              : 'No OAuth data found. Redirecting to login page...'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default OAuthSuccess;