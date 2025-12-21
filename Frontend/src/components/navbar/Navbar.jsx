import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, ShoppingCart, User, Heart, LogOut, Package } from 'lucide-react';
import { NavLink } from './NavLink';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import { useCart } from '../../context/CartContext';

export function Navbar() {
  const { state, dispatch } = useCart();
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
  
  const totalItems = state.items.length; // Count of unique items
  const totalPrice = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);





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
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <ShoppingCart className="h-6 w-6 dark:text-white" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-teal-600 text-white text-xs 
                               w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>

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
