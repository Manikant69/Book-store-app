// Default genre images for when no custom image is provided
export const DEFAULT_GENRE_IMAGES = {
    'Fiction': 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80',
    'Mystery': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=800&q=80',
    'Historical Fiction': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    'History': 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80',
    'Science Fiction': 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    'Romance': 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=800&q=80',
    'Biography': 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&w=800&q=80',
    'Self-Help': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    'Fantasy': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80',
    'Horror': 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    'Thriller': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
};

// Default fallback image when no genre-specific image is found
export const DEFAULT_BOOK_IMAGE = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80';

// API Response status constants
export const API_STATUS = {
    SUCCESS: 'success',
    ERROR: 'error',
    PENDING: 'pending'
};

// Default pagination limits
export const PAGINATION_LIMITS = {
    BOOKS_PER_PAGE: 10,
    GENRES_PER_PAGE: 6,
    REVIEWS_PER_PAGE: 5
};