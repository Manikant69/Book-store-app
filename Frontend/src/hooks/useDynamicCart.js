import { useState, useEffect, useCallback, useRef } from 'react';
import { useCart as useCartAPI } from './useApi';
import Toast from '../utils/toast';

export const useDynamicCart = () => {
  const { addToCart: apiAddToCart, getCart: apiGetCart, updateCartQuantity: apiUpdateQuantity, removeFromCart: apiRemoveFromCart, clearCart: apiClearCart } = useCartAPI();
  
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
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
          
          return {
            id: item.book?._id || item.bookId,
            _id: item.book?._id || item.bookId,
            name: item.book?.name || 'Unknown Book',
            authorName: item.book?.authorName || 'Unknown Author',
            price: item.price || item.book?.price || 0,
            coverImage: item.book?.coverImage || '',
            quantity: item.quantity || 1,
            inStock: item.book?.inStock !== false
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
      // Refresh cart data after a delay to prevent rapid API calls
      setTimeout(() => {
        fetchCart();
      }, 100);
      setIsOpen(true);
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

    setLoading(true);
    try {
      await apiUpdateQuantity(userId, bookId, newQuantity);
      // Refresh cart data after a delay
      setTimeout(() => {
        fetchCart();
      }, 100);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (bookId) => {
    if (!userId) return;

    setLoading(true);
    try {
      await apiRemoveFromCart(userId, bookId);
      // Refresh cart data after a delay
      setTimeout(() => {
        fetchCart();
      }, 100);
    } catch (error) {
      console.error('Error removing from cart:', error);
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

  // Toggle cart sidebar
  const toggleCart = () => {
    setIsOpen(!isOpen);
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
    isOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    toggleCart,
    fetchCart,
    totalItems: cartItems.reduce((sum, item) => sum + item.quantity, 0)
  };
};