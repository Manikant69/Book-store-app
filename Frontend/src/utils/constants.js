// Base API URL - change this for different environments
export const API_BASE_URL =  "http://localhost:5001/api";

// API Endpoints
export const USER_API_END_POINT = `${API_BASE_URL}/users`;
export const BOOK_API_END_POINT = `${API_BASE_URL}/books`;
export const GENRE_API_END_POINT = `${API_BASE_URL}/genres`;
export const CART_API_END_POINT = `${API_BASE_URL}/cart`;
export const WISHLIST_API_END_POINT = `${API_BASE_URL}/wishlist`;
export const ORDER_API_END_POINT = `${API_BASE_URL}/orders`;
export const SETTINGS_API_END_POINT = `${API_BASE_URL}/settings`;

// Default site settings - used as fallbacks when API data is not available
export const DEFAULT_SITE_SETTINGS = {
  email: 'support@bookspot.com',
  phone: '+91-9876543210',
  address: '123 Book Street, Library City, India - 110001',
  siteName: 'BookSpot',
  siteDescription: 'Your one-stop destination for books',
  socialLinks: {
    facebook: 'https://facebook.com/bookspot',
    twitter: 'https://twitter.com/bookspot',
    instagram: 'https://instagram.com/bookspot',
    youtube: 'https://youtube.com/bookspot'
  }
};

// Default contact information for static pages
export const DEFAULT_CONTACT_INFO = {
  email: 'support@bookspot.com',
  phone: '+91-9876543210',
  address: '123 Book Street, Library City, India - 110001',
  legal: {
    email: 'legal@bookspot.com',
    privacy: 'privacy@bookspot.com'
  }
};
