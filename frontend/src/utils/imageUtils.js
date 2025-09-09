// Utility function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // If it's a relative path, prepend the backend URL
  const backendUrl = 'http://localhost:8827';
  return `${backendUrl}${imagePath}`;
};

// Utility function to handle image error fallback
export const handleImageError = (e, fallbackEmoji = '🕯️') => {
  e.target.style.display = 'none';
  if (e.target.nextSibling) {
    e.target.nextSibling.style.display = 'flex';
  }
};