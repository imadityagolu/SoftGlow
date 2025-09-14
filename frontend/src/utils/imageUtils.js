// Utility function to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  // Use the proxied path for development (Vite will proxy /uploads to backend)
  // In production, this should be the full backend URL
  if (import.meta.env.DEV) {
    return imagePath; // Use relative path, Vite proxy will handle it
  } else {
    // Support both VITE_API_URL (new) and VITE_BACKEND_URL (legacy) for backward compatibility
    let backendUrl;
    if (import.meta.env.VITE_API_URL) {
      // Get backend URL from API URL by removing /api suffix
      backendUrl = import.meta.env.VITE_API_URL.replace('/api', '');
    } else {
      // Fallback to legacy VITE_BACKEND_URL
      backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8827';
    }
    return `${backendUrl}${imagePath}`;
  }
};

// Utility function to handle image error fallback
export const handleImageError = (e, fallbackEmoji = '🕯️') => {
  e.target.style.display = 'none';
  if (e.target.nextSibling) {
    e.target.nextSibling.style.display = 'flex';
  }
};