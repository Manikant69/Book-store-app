import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      Toast.warning('Please login to view cart');
      navigate('/login');
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
        navigate('/orders');
      }, 1500);
    }
    setCheckoutLoading(false);
  };

  if (state.loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader />
          </div>
        </main>
        <Footer />
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
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Cart Items */}
          <div className="lg:flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
              <h1 className="text-xl sm:text-2xl font-bold dark:text-white">Shopping Cart</h1>
              <span className="text-gray-600 dark:text-gray-400 text-sm">
                {state.items.length} {state.items.length === 1 ? 'item' : 'items'}
              </span>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {state.items.map((item) => (
                <div
                  key={item.id || item._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    <div className="p-4">
                      <div className="flex gap-4">
                        <div className="shrink-0 w-20 h-28 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                          <img
                            src={item.coverImage || item.coverUrl || '/placeholder-book.jpg'}
                            alt={item.name || item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-book.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-1 truncate">
                                {item.name || item.title || 'Unknown Book'}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                by {item.authorName || item.author || 'Unknown Author'}
                              </p>
                              <p className="text-sm font-medium text-teal-600 dark:text-teal-400">
                                ₹{item.price}
                              </p>
                            </div>
                            <button
                              onClick={() => handleRemoveItem(item.id || item._id)}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors ml-2"
                              disabled={state.loading}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quantity and Total Row */}
                      <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                          <button
                            onClick={() => handleUpdateQuantity(item.id || item._id, item.quantity - 1)}
                            className={`p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors ${
                              state.itemLoading[item.id || item._id] ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={state.itemLoading[item.id || item._id]}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className={`px-3 py-1 text-sm font-medium text-gray-900 dark:text-white min-w-[2rem] text-center transition-opacity ${
                            state.itemLoading[item.id || item._id] ? 'opacity-50' : ''
                          }`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id || item._id, item.quantity + 1)}
                            className={`p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors ${
                              state.itemLoading[item.id || item._id] ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={state.itemLoading[item.id || item._id]}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          {state.itemLoading[item.id || item._id] && (
                            <div className="ml-2 p-1">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:block">
                    <div className="flex gap-6 p-6">
                      <div className="shrink-0 w-24 md:w-32 h-32 md:h-40 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden shadow-md">
                        <img
                          src={item.coverImage || item.coverUrl || '/placeholder-book.jpg'}
                          alt={item.name || item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/placeholder-book.jpg';
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                              {item.name || item.title || 'Unknown Book'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                              by {item.authorName || item.author || 'Unknown Author'}
                            </p>
                            <div className="flex items-center gap-4">
                              <span className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                                ₹{item.price} <span className="text-sm text-gray-500 font-normal">per unit</span>
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id || item._id)}
                            className={`p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200 ${
                              state.itemLoading[item.id || item._id] ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={state.itemLoading[item.id || item._id]}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="relative flex items-center bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                            <button
                              onClick={() => handleUpdateQuantity(item.id || item._id, item.quantity - 1)}
                              className={`p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-l-xl transition-all duration-200 ${
                                state.itemLoading[item.id || item._id] ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={state.itemLoading[item.id || item._id]}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className={`px-6 py-2 text-lg font-semibold text-gray-900 dark:text-white min-w-[3rem] text-center border-x border-gray-200 dark:border-gray-600 transition-opacity ${
                              state.itemLoading[item.id || item._id] ? 'opacity-50' : ''
                            }`}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id || item._id, item.quantity + 1)}
                              className={`p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-r-xl transition-all duration-200 ${
                                state.itemLoading[item.id || item._id] ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={state.itemLoading[item.id || item._id]}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                            {state.itemLoading[item.id || item._id] && (
                              <div className="absolute -right-10 p-1">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-teal-600"></div>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                              ₹{item.price} × {item.quantity}
                            </p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 lg:sticky lg:top-24 lg:h-fit">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6">
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
                  className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm resize-none"
                  rows="3"
                />
              </div>

              <button 
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full py-3 bg-teal-600 text-white rounded-lg 
                         hover:bg-teal-700 transition-colors duration-200 disabled:opacity-50 text-sm sm:text-base"
              >
                {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              
              <Link
                to="/books"
                className="block w-full mt-3 py-2 text-center text-teal-600 
                         hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 text-sm"
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
