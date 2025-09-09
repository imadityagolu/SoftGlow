const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const path = require('path');

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private (Admin only)
router.post('/images', protect, upload.array('images', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded'
      });
    }

    // Generate URLs for uploaded files
    const imageUrls = req.files.map(file => {
      return `/uploads/${file.filename}`;
    });

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully',
      data: {
        images: imageUrls
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during file upload'
    });
  }
});

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private (Admin only)
router.post('/image', protect, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        image: imageUrl
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during file upload'
    });
  }
});

module.exports = router;