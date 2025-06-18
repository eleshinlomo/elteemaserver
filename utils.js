import path from 'path';



export const capitalize = (text) => {
  if (text && typeof text === 'string') {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
  return text; // Return the original input if it's not a string
};




/**
 * Cleans image paths by removing base URL and normalizing
 * @param {string|string[]} imagePath - The image path(s) to clean
 * @returns {string|string[]} Cleaned path(s)
 */
export const cleanImagePath = (imagePath) => {
  const BASE_URL = process.env.BASE_URL || 'http://localhost:3005';
  
  const cleanSinglePath = (path) => {
    return path
      .replace(BASE_URL, '')
      .replace(/^\/+/, '')
      .replace(/\\/g, '/'); // Normalize to forward slashes
  };

  return Array.isArray(imagePath) 
    ? imagePath.map(cleanSinglePath)
    : cleanSinglePath(imagePath);
};

/**
 * Gets the absolute filesystem path for an image
 * @param {string} imagePath - The cleaned image path
 * @returns {string} Absolute filesystem path
 */
export const getImageFilesystemPath = (imagePath) => {
  return path.join(
    process.cwd(),
    'public',
    cleanImagePath(imagePath)
  );
};
