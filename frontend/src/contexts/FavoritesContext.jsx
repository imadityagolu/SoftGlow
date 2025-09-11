import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import favoriteService from '../services/favoriteService';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user, userType } = useAuth();

  // Fetch favorites data
  const fetchFavorites = useCallback(async () => {
    if (token && user && userType === 'customer') {
      try {
        setLoading(true);
        const response = await favoriteService.getUserFavorites();
        if (response.success && response.favorites) {
          setFavorites(response.favorites);
          setFavoritesCount(response.favorites.length);
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
        setFavoritesCount(0);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    } else {
      setFavoritesCount(0);
      setFavorites([]);
      setLoading(false);
    }
  }, [token, user, userType]);

  // Add item to favorites
  const addToFavorites = async (productId) => {
    try {
      const response = await favoriteService.addToFavorites(productId);
      if (response.success) {
        await fetchFavorites(); // Refresh favorites data
        return response;
      }
      throw new Error(response.message || 'Failed to add to favorites');
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  };

  // Remove item from favorites
  const removeFromFavorites = async (productId) => {
    try {
      const response = await favoriteService.removeFromFavorites(productId);
      if (response.success) {
        await fetchFavorites(); // Refresh favorites data
        return response;
      }
      throw new Error(response.message || 'Failed to remove from favorites');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  };

  // Check if product is in favorites
  const checkFavoriteStatus = async (productId) => {
    try {
      const response = await favoriteService.checkFavoriteStatus(productId);
      return response.isFavorite;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  };

  // Fetch favorites when authentication state changes
  useEffect(() => {
    if (token && user && userType === 'customer') {
      fetchFavorites();
    } else {
      setFavoritesCount(0);
      setFavorites([]);
    }
  }, [token, user, userType, fetchFavorites]);

  const value = {
    favoritesCount,
    favorites,
    loading,
    fetchFavorites,
    addToFavorites,
    removeFromFavorites,
    checkFavoriteStatus
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};