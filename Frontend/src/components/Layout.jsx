import React from 'react';
import { Sun, Moon, ShoppingCart, User, Search, Menu } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-400">BookSpot</h1>
            </div>

            <div className="hidden md:block flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search books, authors, genres..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <ShoppingCart className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <User className="h-5 w-5" />
              </button>
            </div>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Discover millions of eBooks, audiobooks, and more at your fingertips.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-600">Home</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-600">Browse</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-600">Categories</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-600">Contact Us</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-600">FAQ</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-600">Shipping</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-600">Twitter</a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-600">Facebook</a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-teal-600">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}