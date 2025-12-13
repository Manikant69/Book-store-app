import React, { useState, useEffect } from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useBooks, useWishlist } from '../../hooks/useApi';
import Toast from '../../utils/toast';

export function BookCard({ book }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, checkInWishlist } = useWishlist();

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const checkWishlist = async () => {
      if (userId && book._id) {
        const inWishlist = await checkInWishlist(userId, book._id);
        setIsWishlisted(inWishlist);
      }
    };
    checkWishlist();
  }, [userId, book._id, checkInWishlist]);

  const handleBookClick = () => {
    navigate(`/books/${book._id}`);
  };

  const handleWishlist = async (e) => {
    e.stopPropagation();
    
    if (!userId) {
      Toast.error('Please login to manage wishlist');
      return;
    }

    try {
      if (isWishlisted) {
        await removeFromWishlist(userId, book._id);
        Toast.success('Removed from wishlist');
      } else {
        await addToWishlist(userId, book._id);
        Toast.success('Added to wishlist');
      }
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      Toast.error('Failed to update wishlist');
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!book.inStock) {
      Toast.error('This book is out of stock');
      return;
    }

    setAddingToCart(true);
    try {
      await addToCart(book);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setTimeout(() => setAddingToCart(false), 1000);
    }
  };

  return (
    <div 
      onClick={handleBookClick}
      className="group bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md 
                transition-shadow duration-200 cursor-pointer"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
        <img
          src={book.coverImage}
          alt={book.name}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-200"
        />
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white 
                   dark:bg-gray-800/80 dark:hover:bg-gray-800 transition-colors duration-200"
          aria-label="Add to wishlist"
        >
          <Heart
            className={`h-5 w-5 transition-colors duration-200 ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'
            }`}
          />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate dark:text-white">
          {book.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
          {book.authorName}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
              {book.rating && book.rating > 0 ? book.rating.toFixed(1) : '0.0'}
            </span>
          </div>
          <span className="font-bold text-teal-600 dark:text-teal-400">
            ${book.price}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={!book.inStock || addingToCart}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 
                   text-white py-2 rounded-lg transition-colors duration-200 
                   flex items-center justify-center gap-2 disabled:cursor-not-allowed
                   font-medium text-sm"
        >
          <ShoppingCart className="h-4 w-4" />
          {addingToCart ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
