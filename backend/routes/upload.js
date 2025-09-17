const express = require('express');
const router = express.Router();
const { upload, cloudinary, uploadToCloudinary } = require('../middleware/cloudinaryUpload');
const { protectAdmin, protectCustomer } = require('../middleware/auth');
const path = require('path');

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private (Admin only)
router.post('/images', protectAdmin, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Upload each file to Cloudinary
    const uploadPromises = req.files.map(file => 
      uploadToCloudinary(file.buffer, {
        public_id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      })
    );

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map(result => result.secure_url);

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        images: imageUrls
      }
    });
  } catch (error) {
    console.error('Multiple images upload error:', {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      filesCount: req.files ? req.files.length : 0
    });
    res.status(500).json({
      success: false,
      message: 'Server error during file upload',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private (Admin only)
router.post('/image', protectAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload file to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      public_id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    const imageUrl = uploadResult.secure_url;

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        image: imageUrl
      }
    });
  } catch (error) {
    console.error('Single image upload error:', {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      hasFile: !!req.file
    });
    res.status(500).json({
      success: false,
      message: 'Server error during file upload',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @desc    Upload feedback image
// @route   POST /api/upload/feedback-image
// @access  Private (Customer only)
router.post('/feedback-image', protectCustomer, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Upload file to Cloudinary
    const uploadResult = await uploadToCloudinary(req.file.buffer, {
      public_id: `feedback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    });

    const imageUrl = uploadResult.secure_url;

    res.status(200).json({
      success: true,
      message: 'Feedback image uploaded successfully',
      data: {
        image: imageUrl
      }
    });
  } catch (error) {
    console.error('Feedback image upload error:', {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      hasFile: !!req.file,
      customerId: req.customer ? req.customer._id : 'unknown'
    });
    res.status(500).json({
      success: false,
      message: 'Server error during file upload',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;