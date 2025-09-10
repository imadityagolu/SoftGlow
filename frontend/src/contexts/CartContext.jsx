import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user, userType } = useAuth();
  const fetchingRef = useRef(false);

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    if (token && user && userType === 'customer' && !fetchingRef.current) {
      fetchingRef.current = true;
      try {
        setLoading(true);
        const response = await cartService.getCart();
        if (response.success && response.data) {
          const items = response.data.items || [];
          setCartItems(items);
          setCartItemCount(items.reduce((total, item) => total + item.quantity, 0));
        } else if (response.cart) {
          const items = response.cart.items || [];
          setCartItems(items);
          setCartItemCount(items.reduce((total, item) => total + item.quantity, 0));
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
        // Don't retry on network errors to prevent infinite loops
        setCartItemCount(0);
        setCartItems([]);
      } finally {
        setLoading(false);
        fetchingRef.current = false;
      }
    } else if (!token || !user || userType !== 'customer') {
      setCartItemCount(0);
      setCartItems([]);
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [token, user, userType]);

  // Add item to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await cartService.addToCart(productId, quantity);
      // Backend returns { message: 'Item added to cart successfully', cart: {...} }
      if (response.message && response.cart) {
        await fetchCart(); // Refresh cart data
        return response;
      }
      throw new Error(response.message || 'Failed to add item to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity) => {
    try {
      console.log('Frontend updateCartItem called with:', { itemId, quantity });
      const response = await cartService.updateCartItem(itemId, quantity);
      if (response.message && response.cart) {
        await fetchCart(); // Refresh cart data
        return response;
      }
      throw new Error(response.message || 'Failed to update cart item');
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    try {
      console.log('Frontend removeFromCart called with:', { itemId });
      const response = await cartService.removeFromCart(itemId);
      if (response.message && response.cart) {
        await fetchCart(); // Refresh cart data
        return response;
      }
      throw new Error(response.message || 'Failed to remove item from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      const response = await cartService.clearCart();
      if (response.message && response.cart) {
        await fetchCart(); // Refresh cart data
        return response;
      }
      throw new Error(response.message || 'Failed to clear cart');
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  };

  // Fetch cart when authentication state changes
  useEffect(() => {
    if (token && user && userType === 'customer') {
      fetchCart();
    } else {
      setCartItemCount(0);
      setCartItems([]);
    }
  }, [token, user, userType, fetchCart]);

  const value = {
    cartItemCount,
    cartItems,
    loading,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};