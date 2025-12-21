import axios from 'axios';
import Toast from '../utils/toast';
import { BOOK_API_END_POINT, CART_API_END_POINT, WISHLIST_API_END_POINT, ORDER_API_END_POINT, GENRE_API_END_POINT } from '../utils/constants';

// Book API Hooks
export const useBooks = () => {
  const getAllBooks = async (search = '', genre = '', sortBy = '', page = 1, limit = 10, maxPrice = null, minRating = null, language = '') => {
    try {
      let url = `${BOOK_API_END_POINT}?page=${page}&limit=${limit}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (genre) url += `&genre=${encodeURIComponent(genre)}`;
      if (sortBy) url += `&sortBy=${sortBy}`;
      if (maxPrice && maxPrice < 100) url += `&maxPrice=${maxPrice}`;
      if (minRating) url += `&minRating=${minRating}`;
      if (language) url += `&language=${encodeURIComponent(language)}`;
      
      console.log('Making API call to:', url);
      console.log('Parameters:', { search, genre, sortBy, page, limit, maxPrice, minRating, language });
      
      const res = await axios.get(url);
      console.log('API Response status:', res.status);
      console.log('API Response data:', res.data);
      return res.data;
    } catch (error) {
      console.error('API Error:', error);
      console.error('API Error response:', error.response?.data);
      Toast.error(error.response?.data?.message || 'Error fetching books');
      return null;
    }
  };

  const getBook = async (bookId) => {
    try {
      const res = await axios.get(`${BOOK_API_END_POINT}/${bookId}`);
      return res.data.book;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error fetching book');
      return null;
    }
  };

  const getPopularBooks = async (limit = 10) => {
    try {
      const res = await axios.get(`${BOOK_API_END_POINT}/popular?limit=${limit}`);
      return res.data.books;
    } catch (error) {
      Toast.error('Error fetching popular books');
      return [];
    }
  };

  const getBooksByGenre = async (genre) => {
    try {
      const res = await axios.get(`${BOOK_API_END_POINT}/genre/${genre}`);
      return res.data.books;
    } catch (error) {
      Toast.error(`Error fetching ${genre} books`);
      return [];
    }
  };

  const addBook = async (formData) => {
    try {
      const res = await axios.post(`${BOOK_API_END_POINT}/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Toast.success('Book added successfully!');
      return res.data.book;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error adding book');
      return null;
    }
  };

  const updateBook = async (bookId, formData) => {
    try {
      const res = await axios.put(`${BOOK_API_END_POINT}/update/${bookId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Toast.success('Book updated successfully!');
      return res.data.book;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error updating book');
      return null;
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await axios.delete(`${BOOK_API_END_POINT}/delete/${bookId}`);
      Toast.success('Book deleted successfully!');
      return true;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error deleting book');
      return false;
    }
  };

  const getReviews = async (bookId) => {
    try {
      const res = await axios.get(`${BOOK_API_END_POINT}/${bookId}/reviews`);
      return res.data;
    } catch (error) {
      Toast.error('Error fetching reviews');
      return null;
    }
  };

  const addReview = async (bookId, reviewData) => {
    try {
      const res = await axios.post(`${BOOK_API_END_POINT}/${bookId}/reviews`, reviewData);
      Toast.success('Review added successfully!');
      return res.data.book;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error adding review');
      return null;
    }
  };

  const searchBooks = async (query, filters = {}) => {
    try {
      let url = `${BOOK_API_END_POINT}/search?q=${encodeURIComponent(query)}`;
      
      if (filters.genre) url += `&genre=${encodeURIComponent(filters.genre)}`;
      if (filters.sortBy) url += `&sortBy=${filters.sortBy}`;
      if (filters.page) url += `&page=${filters.page}`;
      if (filters.limit) url += `&limit=${filters.limit}`;
      if (filters.maxPrice && filters.maxPrice < 100) url += `&maxPrice=${filters.maxPrice}`;
      if (filters.minRating) url += `&minRating=${filters.minRating}`;
      if (filters.language) url += `&language=${encodeURIComponent(filters.language)}`;
      
      console.log('Search API call to:', url);
      const res = await axios.get(url);
      return res.data;
    } catch (error) {
      console.error('Search API Error:', error);
      Toast.error(error.response?.data?.message || 'Error searching books');
      return null;
    }
  };

  return {
    getAllBooks,
    getBook,
    getPopularBooks,
    getBooksByGenre,
    addBook,
    updateBook,
    deleteBook,
    getReviews,
    addReview,
    searchBooks
  };
};

// Genre API Hooks
export const useGenres = () => {
  const getGenres = async () => {
    try {
      const res = await axios.get(`${GENRE_API_END_POINT}`);
      return res.data;
    } catch (error) {
      console.error('Genre fetch error:', error);
      Toast.error(error.response?.data?.message || 'Error fetching genres');
      return { success: false, genres: [] };
    }
  };

  const addGenre = async (genreData) => {
    try {
      const res = await axios.post(`${GENRE_API_END_POINT}`, genreData);
      Toast.success('Genre added successfully');
      return res.data;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error adding genre');
      return { success: false };
    }
  };

  return {
    getGenres,
    addGenre
  };
};

// Cart API Hooks
export const useCart = () => {
  const addToCart = async (userId, bookId, quantity) => {
    try {
      const res = await axios.post(`${CART_API_END_POINT}/add`, {
        userId,
        bookId,
        quantity
      });
      Toast.success('Added to cart!');
      return res.data.cart;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error adding to cart');
      return null;
    }
  };

  const getCart = async (userId) => {
    try {
      const res = await axios.get(`${CART_API_END_POINT}/${userId}`);
      return res.data;
    } catch (error) {
      Toast.error('Error fetching cart');
      return null;
    }
  };

  const updateCartQuantity = async (userId, bookId, quantity) => {
    try {
      const res = await axios.put(`${CART_API_END_POINT}/${userId}/${bookId}`, {
        quantity
      });
      return res.data.cart;
    } catch (error) {
      Toast.error('Error updating cart');
      return null;
    }
  };

  const removeFromCart = async (userId, bookId) => {
    try {
      const res = await axios.delete(`${CART_API_END_POINT}/${userId}/${bookId}`);
      return res.data.cart;
    } catch (error) {
      Toast.error('Error removing from cart');
      return null;
    }
  };

  const clearCart = async (userId) => {
    try {
      await axios.delete(`${CART_API_END_POINT}/${userId}/clear`);
      Toast.success('Cart cleared');
      return true;
    } catch (error) {
      Toast.error('Error clearing cart');
      return false;
    }
  };

  return {
    addToCart,
    getCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
  };
};

// Wishlist API Hooks
export const useWishlist = () => {
  const addToWishlist = async (userId, bookId) => {
    try {
      const res = await axios.post(`${WISHLIST_API_END_POINT}/add`, {
        userId,
        bookId
      });
      Toast.success('Added to wishlist!');
      return res.data.wishlist;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error adding to wishlist');
      return null;
    }
  };

  const getWishlist = async (userId) => {
    try {
      const res = await axios.get(`${WISHLIST_API_END_POINT}/${userId}`);
      return res.data.wishlist;
    } catch (error) {
      Toast.error('Error fetching wishlist');
      return [];
    }
  };

  const removeFromWishlist = async (userId, bookId) => {
    try {
      const res = await axios.delete(`${WISHLIST_API_END_POINT}/${userId}/${bookId}`);
      Toast.success('Removed from wishlist');
      return res.data.wishlist;
    } catch (error) {
      Toast.error('Error removing from wishlist');
      return null;
    }
  };

  const checkInWishlist = async (userId, bookId) => {
    try {
      const res = await axios.get(`${WISHLIST_API_END_POINT}/${userId}/${bookId}/check`);
      return res.data.isInWishlist;
    } catch (error) {
      return false;
    }
  };

  return {
    addToWishlist,
    getWishlist,
    removeFromWishlist,
    checkInWishlist
  };
};

// Order API Hooks
export const useOrder = () => {
  const createOrder = async (userId, items, totalAmount, shippingAddress, paymentMethod = 'COD') => {
    try {
      const res = await axios.post(`${ORDER_API_END_POINT}/create`, {
        userId,
        items,
        totalAmount,
        shippingAddress,
        paymentMethod
      });
      Toast.success('Order placed successfully!');
      return res.data.order;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error creating order');
      return null;
    }
  };

  const getUserOrders = async (userId) => {
    try {
      const res = await axios.get(`${ORDER_API_END_POINT}/${userId}`);
      return res.data.orders;
    } catch (error) {
      Toast.error('Error fetching orders');
      return [];
    }
  };

  const getOrderDetails = async (userId, orderId) => {
    try {
      const res = await axios.get(`${ORDER_API_END_POINT}/${userId}/${orderId}`);
      return res.data.order;
    } catch (error) {
      Toast.error('Error fetching order details');
      return null;
    }
  };

  const cancelOrder = async (userId, orderId) => {
    try {
      const res = await axios.delete(`${ORDER_API_END_POINT}/${userId}/${orderId}/cancel`);
      Toast.success('Order cancelled successfully');
      return res.data.order;
    } catch (error) {
      Toast.error(error.response?.data?.message || 'Error cancelling order');
      return null;
    }
  };

  const updateOrderStatus = async (userId, orderId, status) => {
    try {
      const res = await axios.put(`${ORDER_API_END_POINT}/${userId}/${orderId}/status`, {
        status
      });
      Toast.success('Order status updated');
      return res.data.order;
    } catch (error) {
      Toast.error('Error updating order status');
      return null;
    }
  };

  return {
    createOrder,
    getUserOrders,
    getOrderDetails,
    cancelOrder,
    updateOrderStatus
  };
};
