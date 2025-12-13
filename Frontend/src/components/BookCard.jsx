import React from 'react';
import { Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Toast from '../utils/toast';

export default function BookCard({ book, onAddToWishlist }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleBookClick = () => {
    navigate(`/books/${book._id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    
    if (!book.inStock) {
      Toast.error('This book is out of stock');
      return;
    }

    try {
      await addToCart(book);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleBookClick}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-t-lg">
        <img
          src={book.coverImage}
          alt={book.name}
          className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-200"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToWishlist?.(book._id);
          }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800"
        >
          <Heart className="h-5 w-5 text-gray-600 hover:text-red-500" />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 truncate dark:text-white">{book.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{book.authorName}</p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{book.rating}</span>
          </div>
          <span className="font-bold text-teal-600 dark:text-teal-400">${book.price}</span>
        </div>
        
        <button
          onClick={handleAddToCart}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}