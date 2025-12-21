import { useState, useEffect, useCallback, useRef } from 'react';
import { useCart as useCartAPI } from './useApi';
import Toast from '../utils/toast';

export const useDynamicCart = () => {
  const { addToCart: apiAddToCart, getCart: apiGetCart, updateCartQuantity: apiUpdateQuantity, removeFromCart: apiRemoveFromCart, clearCart: apiClearCart } = useCartAPI();
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [initialized, setInitialized] = useState(false);
  
  const userId = localStorage.getItem('userId');
  const fetchingRef = useRef(false);

  // Calculate total from items
  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  // Fetch cart data from backend with debouncing
  const fetchCart = useCallback(async () => {
    if (!userId || fetchingRef.current) {
      setCartItems([]);
      setTotal(0);
      return;
    }

    fetchingRef.current = true;
    setLoading(true);
    
    try {
      const cartData = await apiGetCart(userId);
      console.log('Cart data received:', cartData); // Debug log
      
      if (cartData && cartData.cart) {
        // Transform cart data to match frontend structure
        const transformedItems = cartData.cart.map(item => {
          console.log('Processing cart item:', item); // Debug log
          
          // Handle both possible data structures from backend
          const book = item.book || {};
          
          return {
            id: book._id || item.bookId,
            _id: book._id || item.bookId,
            name: book.name || book.title || 'Unknown Book',
            title: book.name || book.title || 'Unknown Book', // Add title for compatibility
            authorName: book.authorName || book.author || 'Unknown Author',
            author: book.authorName || book.author || 'Unknown Author', // Add author for compatibility
            price: item.price || book.price || 0,
            coverImage: book.coverImage || book.coverUrl || '',
            coverUrl: book.coverImage || book.coverUrl || '', // Add coverUrl for compatibility
            quantity: item.quantity || 1,
            inStock: book.inStock !== false
          };
        });
        
        console.log('Transformed items:', transformedItems); // Debug log
        
        setCartItems(transformedItems);
        setTotal(cartData.total || calculateTotal(transformedItems));
      } else {
        setCartItems([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
      setInitialized(true);
    }
  }, [userId]); // Removed apiGetCart from dependencies to prevent infinite loops

  // Add item to cart
  const addToCart = async (book) => {
    if (!userId) {
      Toast.error('Please login to add items to cart');
      return;
    }

    if (!book || !book._id) {
      Toast.error('Invalid book data');
      console.error('Invalid book object:', book);
      return;
    }

    console.log('Adding to cart:', {
      userId,
      bookId: book._id,
      quantity: 1,
      book
    });

    setLoading(true);
    try {
      await apiAddToCart(userId, book._id, 1);
      // Refresh cart data immediately
      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      Toast.error('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  // Update quantity
  const updateQuantity = async (bookId, newQuantity) => {
    if (!userId || newQuantity < 1) return;

    console.log('Updating quantity:', { userId, bookId, newQuantity }); // Debug log
    setLoading(true);
    try {
      const result = await apiUpdateQuantity(userId, bookId, newQuantity);
      console.log('Update quantity result:', result); // Debug log
      // Refresh cart data immediately
      await fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      Toast.error('Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (bookId) => {
    if (!userId) return;

    console.log('Removing from cart:', { userId, bookId }); // Debug log
    setLoading(true);
    try {
      const result = await apiRemoveFromCart(userId, bookId);
      console.log('Remove from cart result:', result); // Debug log
      // Refresh cart data immediately
      await fetchCart();
      Toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      Toast.error('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      await apiClearCart(userId);
      setCartItems([]);
      setTotal(0);
      Toast.success('Cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize cart data on mount - only once
  useEffect(() => {
    if (userId && !initialized) {
      fetchCart();
    }
  }, [userId]); // Removed fetchCart from dependencies

  return {
    cartItems,
    loading,
    total,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
    totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0)
  };
};