// Utility function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If it's already a full URL (Cloudinary or other CDN), return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Handle legacy local uploads - construct full URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8827';
  
  // If it's a relative path starting with /uploads, construct full URL
  if (imagePath.startsWith('/uploads')) {
    return `${backendUrl}${imagePath}`;
  }
  
  // For development with Vite proxy
  if (import.meta.env.DEV && imagePath.startsWith('/uploads')) {
    return imagePath; // Use relative path, Vite proxy will handle it
  }
  
  // Default case - assume it's a relative path
  return `${backendUrl}${imagePath.startsWith('/') ? imagePath : '/' + imagePath}`;
};

// Utility function to handle image error fallback
export const handleImageError = (e, fallbackEmoji = '🕯️') => {
  e.target.style.display = 'none';
  if (e.target.nextSibling) {
    e.target.nextSibling.style.display = 'flex';
  }
};