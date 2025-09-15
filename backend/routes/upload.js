const express = require('express');
const router = express.Router();
const { upload, cloudinary, uploadToCloudinary } = require('../middleware/cloudinaryUpload');
const { protect } = require('../middleware/auth');
const path = require('path');

// @desc    Upload multiple images
// @route   POST /api/upload/images
// @access  Private (Admin only)
router.post('/images', protect, upload.array('images', 10), async (req, res) => {
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
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during file upload',
      error: error.message
    });
  }
});

// @desc    Upload single image
// @route   POST /api/upload/image
// @access  Private (Admin only)
router.post('/image', protect, upload.single('image'), async (req, res) => {
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
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during file upload',
      error: error.message
    });
  }
});

module.exports = router;