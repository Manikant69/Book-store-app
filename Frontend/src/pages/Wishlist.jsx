import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/layout/Footer';
import { useWishlist, useCart } from '../hooks/useApi';
import { Loader } from '../components/common/Loader';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Toast from '../utils/toast';

function Wishlist() {
  const { getWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      Toast.warning('Please login to view wishlist');
      navigate('/login');
      return;
    }

    const fetchWishlist = async () => {
      setLoading(true);
      const result = await getWishlist(userId);
      if (result) {
        setWishlistBooks(result);
      }
      setLoading(false);
    };

    fetchWishlist();
  }, [userId]);

  const handleRemoveFromWishlist = async (bookId) => {
    const result = await removeFromWishlist(userId, bookId);
    if (result !== null) {
      setWishlistBooks(wishlistBooks.filter(book => book._id !== bookId));
    }
  };

  const handleAddToCart = async (bookId) => {
    const result = await addToCart(userId, bookId, 1);
    if (result) {
      // Remove from wishlist after adding to cart
      handleRemoveFromWishlist(bookId);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8 dark:text-white flex items-center gap-2">
            <Heart className="text-red-500" />
            My Wishlist
          </h1>
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 dark:text-white flex items-center gap-2">
          <Heart className="text-red-500" />
          My Wishlist
        </h1>

        {wishlistBooks.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Your wishlist is empty</p>
            <a href="/books" className="text-teal-600 dark:text-teal-400 hover:underline">
              Browse books
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistBooks.map((book) => (
              <div key={book._id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                {book.coverImage && (
                  <img 
                    src={book.coverImage} 
                    alt={book.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 dark:text-white line-clamp-2">
                    {book.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    by {book.authorName}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                        ₹{book.price}
                      </p>
                      {book.rating && (
                        <p className="text-sm text-yellow-500">⭐ {book.rating}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(book._id)}
                      className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition flex items-center justify-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>
                    
                    <button
                      onClick={() => handleRemoveFromWishlist(book._id)}
                      className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 p-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Wishlist;
