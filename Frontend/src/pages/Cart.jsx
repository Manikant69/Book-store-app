import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/layout/Footer';
import { useCart as useCartContext } from '../context/CartContext';
import { useOrder } from '../hooks/useApi';
import { Loader } from '../components/common/Loader';
import Toast from '../utils/toast';

function Cart() {
  const { state, updateQuantity, removeFromCart, fetchCart } = useCartContext();
  const { createOrder } = useOrder();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      Toast.warning('Please login to view cart');
      window.location.href = '/login';
      return;
    }

    // Fetch cart data on mount
    if (fetchCart) {
      fetchCart();
    }
  }, [userId, fetchCart]);

  const handleRemoveItem = async (bookId) => {
    await removeFromCart(bookId);
  };

  const handleUpdateQuantity = async (bookId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(bookId);
      return;
    }

    await updateQuantity(bookId, newQuantity);
  };

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      Toast.warning('Please enter shipping address');
      return;
    }

    if (!state.items || state.items.length === 0) {
      Toast.warning('Your cart is empty');
      return;
    }

    setCheckoutLoading(true);
    
    // Transform cart items for order creation
    const orderItems = state.items.map(item => ({
      bookId: item.id || item._id,
      quantity: item.quantity,
      price: item.price
    }));

    const result = await createOrder(
      userId,
      orderItems,
      state.total,
      shippingAddress,
      'COD'
    );

    if (result) {
      // Clear cart after successful order
      setTimeout(() => {
        window.location.href = '/orders';
      }, 1500);
    }
    setCheckoutLoading(false);
  };

  if (state.loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loader />
      </div>
    );
  }

  if (!state.items || state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 mx-auto text-gray-400 mb-6" />
            <h2 className="text-2xl font-bold mb-4 dark:text-white">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Looks like you haven't added any books to your cart yet.
            </p>
            <Link
              to="/books"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 
                       text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = state.total || 0;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:flex-1">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold dark:text-white">Shopping Cart</h1>
              <span className="text-gray-600 dark:text-gray-400">
                {state.items.length} items
              </span>
            </div>

            <div className="space-y-4">
              {state.items.map((item) => (
                <div
                  key={item.id || item._id}
                  className="flex gap-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
                >
                  <div className="shrink-0 w-32 h-44 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      src={item.coverImage || item.coverUrl || '/placeholder-book.jpg'}
                      alt={item.name || item.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-book.jpg';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-lg font-semibold dark:text-white">
                          {item.name || item.title || 'Unknown Book'}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          by {item.authorName || item.author || 'Unknown Author'}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                          ₹{item.price} per unit
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id || item._id)}
                        className="text-gray-400 hover:text-red-500 p-1"
                        disabled={state.loading}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    
                    <div className="mt-4 flex items-end justify-between">
                      <div className="flex items-center gap-2 border rounded-lg dark:border-gray-600">
                        <button
                          onClick={() => handleUpdateQuantity(item.id || item._id, item.quantity - 1)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          disabled={state.loading}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-medium dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id || item._id, item.quantity + 1)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                          disabled={state.loading}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ₹{item.price} each
                        </p>
                        <p className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">
                Order Summary
              </h2>
              
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="dark:text-white">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax (10%)</span>
                  <span className="dark:text-white">₹{tax.toFixed(2)}</span>
                </div>
                <div className="border-t dark:border-gray-700 pt-3">
                  <div className="flex justify-between font-semibold">
                    <span className="dark:text-white">Total</span>
                    <span className="text-teal-600 dark:text-teal-400">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium dark:text-white mb-2">
                  Shipping Address
                </label>
                <textarea
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Enter your shipping address"
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows="3"
                />
              </div>

              <button 
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full mt-6 py-3 bg-teal-600 text-white rounded-lg 
                         hover:bg-teal-700 transition-colors duration-200 disabled:opacity-50"
              >
                {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              
              <Link
                to="/books"
                className="block w-full mt-4 py-3 text-center text-teal-600 
                         hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Cart;
