import React, { createContext, useContext, useMemo, useCallback } from 'react';
import { useDynamicCart } from '../hooks/useDynamicCart';

// CartContext creation
const CartContext = createContext(null);

// CartProvider component using dynamic cart
export function CartProvider({ children }) {
  const cartData = useDynamicCart();

  // Memoize dispatch function to prevent unnecessary re-renders
  const dispatch = useCallback((action) => {
    switch (action.type) {
      case 'ADD_ITEM':
        cartData.addToCart(action.payload);
        break;
      case 'REMOVE_ITEM':
        cartData.removeFromCart(action.payload);
        break;
      case 'UPDATE_QUANTITY':
        cartData.updateQuantity(action.payload.id, action.payload.quantity);
        break;
      case 'CLEAR_CART':
        cartData.clearCart();
        break;
      default:
        break;
    }
  }, [cartData]);

  // Memoize the entire context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    state: {
      items: cartData.cartItems,
      total: cartData.total,
      loading: cartData.loading,
      itemLoading: cartData.itemLoading || {} // Add item-specific loading
    },
    dispatch,
    // Expose additional methods for direct use
    addToCart: cartData.addToCart,
    updateQuantity: cartData.updateQuantity,
    removeFromCart: cartData.removeFromCart,
    clearCart: cartData.clearCart,
    fetchCart: cartData.fetchCart,
    totalItems: cartData.totalItems
  }), [
    cartData.cartItems,
    cartData.total,
    cartData.loading,
    cartData.itemLoading,
    cartData.totalItems,
    dispatch,
    cartData.addToCart,
    cartData.updateQuantity,
    cartData.removeFromCart,
    cartData.clearCart,
    cartData.fetchCart
  ]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// useCart hook
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
