import React from 'react';
import { Menu, X, LogOut, Package, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { NavLink } from './NavLink';
import { ThemeToggle } from './ThemeToggle';

export function MobileMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    setIsOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-6 w-6 dark:text-white" /> : <Menu className="h-6 w-6 dark:text-white" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg border-t dark:border-gray-700 z-40">
          <nav className="flex flex-col">
            {/* Navigation Links */}
            <Link
              to="/"
              onClick={closeMenu}
              className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/books"
              onClick={closeMenu}
              className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Browse Books
            </Link>
            {userRole === 'admin' && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Admin Panel
              </Link>
            )}
            <Link
              to="/about"
              onClick={closeMenu}
              className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={closeMenu}
              className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Contact
            </Link>
            
            {/* User Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-2">
              {userId ? (
                <>
                  {/* User Info */}
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700">
                    <p className="font-semibold dark:text-white text-sm">{userName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{userEmail}</p>
                  </div>
                  
                  {/* User Actions */}
                  <Link
                    to="/orders"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Package className="h-5 w-5" />
                    My Orders
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Heart className="h-5 w-5" />
                    Wishlist
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2 p-4">
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="block w-full px-4 py-2 text-center text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="block w-full px-4 py-2 text-center bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
            
            {/* Theme Toggle */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-200">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}