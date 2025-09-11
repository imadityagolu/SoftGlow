const Favorite = require('../models/Favorite');
const Product = require('../models/Product');

// Add product to favorites
const addToFavorites = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;
    const userType = req.userType.charAt(0).toUpperCase() + req.userType.slice(1); // Capitalize first letter

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      userId: userId,
      productId: productId
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Product already in favorites' });
    }

    // Create new favorite
    const favorite = new Favorite({
      userId: userId,
      userType: userType,
      productId: productId
    });

    await favorite.save();

    res.status(201).json({
      success: true,
      message: 'Product added to favorites',
      favorite
    });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    res.status(500).json({ message: 'Error adding product to favorites' });
  }
};

// Remove product from favorites
const removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const favorite = await Favorite.findOneAndDelete({
      userId: userId,
      productId: productId
    });

    if (!favorite) {
      return res.status(404).json({ message: 'Favorite not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Product removed from favorites'
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    res.status(500).json({ message: 'Error removing product from favorites' });
  }
};

// Get user's favorites
const getUserFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const favorites = await Favorite.find({ userId: userId })
      .populate('productId', 'name price images description category inStock')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Favorite.countDocuments({ userId: userId });

    res.status(200).json({
      success: true,
      favorites,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
};

// Check if product is in user's favorites
const checkFavoriteStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const favorite = await Favorite.findOne({
      userId: userId,
      productId: productId
    });

    res.status(200).json({
      success: true,
      isFavorite: !!favorite
    });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    res.status(500).json({ message: 'Error checking favorite status' });
  }
};

// Get favorite count for a product
const getFavoriteCount = async (req, res) => {
  try {
    const { productId } = req.params;

    const count = await Favorite.countDocuments({ productId: productId });

    res.status(200).json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error getting favorite count:', error);
    res.status(500).json({ message: 'Error getting favorite count' });
  }
};

module.exports = {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  checkFavoriteStatus,
  getFavoriteCount
};