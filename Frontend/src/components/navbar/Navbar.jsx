import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, ShoppingCart, User, X, Plus, Minus, Heart, LogOut, Package } from 'lucide-react';
import { NavLink } from './NavLink';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { useCart } from '../../context/CartContext';

export function Navbar() {
  const { state, dispatch } = useCart();
  const dropdownRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setShowUserMenu(false);
    navigate('/login');
  };
  
  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        dispatch({ type: 'TOGGLE_CART' });
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    if (state.isOpen || showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [state.isOpen, showUserMenu, dispatch]);



  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) {
      dispatch({ type: 'REMOVE_ITEM', payload: id });
      return;
    }
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity: newQuantity } });
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/logo.png" alt="logo" className='w-7' />
              <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                BookSpot
              </h1>
            </Link>
          </div>

          <nav className="dark:text-white hidden md:flex items-center space-x-4">
            <NavLink href="/" >Home</NavLink>
            <NavLink href="/books">Browse Books</NavLink>
            {userRole === 'admin' && <NavLink href="/admin">Admin Panel</NavLink>}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Cart Button */}
            <div className="relative">
              <button
                onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <ShoppingCart className="h-6 w-6 dark:text-white" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs 
                                 w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Cart Dropdown */}
              {state.isOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 
                           rounded-lg shadow-lg border dark:border-gray-700 z-50"
                >
                  <div className="p-4 border-b dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold dark:text-white">Shopping Cart</h3>
                      <button
                        onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {state.items.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        Your cart is empty
                      </div>
                    ) : (
                      <div className="divide-y dark:divide-gray-700">
                        {state.items.map((item) => (
                          <div key={item.id} className="p-4 flex gap-4">
                            <img
                              src={item.coverUrl}
                              alt={item.title}
                              className="w-16 h-20 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium dark:text-white truncate">
                                {item.title}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                ${item.price}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="text-sm dark:text-white">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: item.id })}
                              className="text-red-500 hover:text-red-600"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {state.items.length > 0 && (
                    <div className="p-4 border-t dark:border-gray-700">
                      <div className="flex justify-between mb-4">
                        <span className="font-medium dark:text-white">Total</span>
                        <span className="font-medium text-teal-600 dark:text-teal-400">
                          ${totalPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <Link
                          to="/cart"
                          onClick={() => dispatch({ type: 'TOGGLE_CART' })}
                          className="block w-full py-2 text-center bg-teal-600 text-white 
                                   rounded-lg hover:bg-teal-700 transition-colors duration-200"
                        >
                          View Cart
                        </Link>
                        <button
                          className="w-full py-2 text-center bg-gray-900 text-white 
                                   rounded-lg hover:bg-gray-800 transition-colors duration-200"
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              to="/wishlist"
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <Heart className="h-6 w-6 dark:text-white" />
            </Link>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <User className="h-6 w-6 dark:text-white" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 
                             rounded-lg shadow-lg border dark:border-gray-700 z-50">
                  {userId ? (
                    <>
                      <div className="p-4 border-b dark:border-gray-700">
                        <p className="font-semibold dark:text-white text-sm">{userName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</p>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/orders"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 
                                   dark:hover:bg-gray-700 text-sm dark:text-white"
                        >
                          <Package className="h-4 w-4" />
                          My Orders
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 
                                   dark:hover:bg-gray-700 text-sm dark:text-white"
                        >
                          <Heart className="h-4 w-4" />
                          Wishlist
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 
                                   dark:hover:bg-gray-700 text-sm dark:text-white text-red-600 
                                   dark:text-red-400 font-medium"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="py-2">
                      <Link
                        to="/login"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                                 text-sm dark:text-white"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setShowUserMenu(false)}
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                                 text-sm dark:text-white"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <MobileMenu className="dark:text-white"/>
        </div>
      </div>
    </header>
  );
}
