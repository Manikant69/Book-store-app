import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Heart, ShoppingCart, MessageCircle, X } from 'lucide-react';
import { Navbar } from '../components/navbar/Navbar';
import { Footer } from '../components/layout/Footer';
import { useBook } from '../context/BookContext';
import { useCart } from '../context/CartContext';
import { Loader } from '../components/common/Loader';
import { useBooks } from '../hooks/useApi';
import Toast from '../utils/toast';

function BookDetails() {
  const { bookId } = useParams();
  const { books } = useBook();
  const { addToCart } = useCart();
  const { getBook, addReview } = useBooks();
  
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        if (bookId) {
          const bookData = await getBook(bookId);
          if (bookData) {
            setBook(bookData);
            // Use reviews from book data if available, otherwise empty array
            if (bookData.reviews && Array.isArray(bookData.reviews)) {
              setReviews(bookData.reviews);
            } else {
              // Set empty reviews array initially
              setReviews([]);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching book:', error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleAddToCart = async () => {
    if (book) {
      try {
        await addToCart(book);
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!userId) {
      Toast.error('Please login to submit a review');
      return;
    }

    if (!reviewForm.comment.trim()) {
      Toast.error('Please write a comment');
      return;
    }

    setReviewSubmitting(true);
    try {
      const result = await addReview(bookId, {
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        userId
      });

      if (result) {
        Toast.success('Review submitted successfully!');
        setReviewForm({ rating: 5, comment: '' });
        setShowReviewForm(false);

        // Add new review locally instead of API call
        const newReview = {
          _id: Date.now().toString(),
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          createdAt: new Date().toISOString(),
          userId: { _id: userId, name: localStorage.getItem('userName') || 'User' }
        };
        setReviews(prev => [newReview, ...prev]);
      }
    } catch (error) {
      Toast.error(error.message || 'Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold dark:text-white mb-4">Book not found</h1>
            <p className="text-gray-600 dark:text-gray-400">The book you're looking for doesn't exist or has been removed.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const averageRating =
    Array.isArray(reviews) && reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="md:flex">

            {/* Book Cover */}
            <div className="md:w-1/3 p-6">
              <div className="aspect-[2/3] relative rounded-lg overflow-hidden">
                <img
                  src={book.coverImage || '/placeholder-book.jpg'}
                  alt={book.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Book Details */}
            <div className="md:w-2/3 p-6">

              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2 dark:text-white">{book.name}</h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">by {book.authorName}</p>
                </div>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Heart
                    className={`h-6 w-6 ${
                      isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'
                    }`}
                  />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {averageRating > 0 ? `${averageRating} out of 5` : 'No ratings yet'} ({Array.isArray(reviews) ? reviews.length : 0} reviews)
                </span>
              </div>

              {/* Genre */}
              <div className="flex flex-wrap gap-2 mb-4">
                {Array.isArray(book.genre) && book.genre.map((genre) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-teal-50 dark:bg-teal-900/20 text-teal-600 
                               dark:text-teal-400 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {/* Price + Stock */}
              <div className="mb-6">
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-2">${book.price}</p>
                <p className={`text-sm ${book.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {book.inStock ? 'In Stock' : 'Out of Stock'}
                </p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 dark:text-white">Description</h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{book.description}</p>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!book.inStock}
                  className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg 
                             hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-2 font-medium"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </button>

                <button
                  onClick={() => setShowReviewForm(true)}
                  className="px-6 py-3 border border-gray-200 dark:border-gray-700 
                             rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 
                             transition flex items-center gap-2 dark:text-white"
                >
                  <MessageCircle className="h-5 w-5" />
                  Write Review
                </button>
              </div>

              {/* Review Modal */}
              {showReviewForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">

                    <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
                      <h3 className="text-lg font-semibold dark:text-white">Write a Review</h3>
                      <button
                        onClick={() => setShowReviewForm(false)}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSubmitReview} className="p-6 space-y-4">
                      <div>
                        <label className="block text-sm font-medium dark:text-gray-300 mb-2">
                          Rating
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                              className="hover:scale-110 transition"
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  star <= reviewForm.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        placeholder="Share your thoughts about this book..."
                        className="w-full px-4 py-2 border dark:border-gray-700 rounded-lg 
                                   dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-teal-500"
                        rows={4}
                      />

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={reviewSubmitting}
                          className="flex-1 bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 
                                     disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>

                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="flex-1 border dark:border-gray-700 py-2 rounded-lg dark:text-white 
                                     hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>

                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Book Information */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Book Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Language:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{book.language}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Publication Year:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{book.publishYear}</span>
              </div>
              {book.isbn && (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">ISBN:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{book.isbn}</span>
                </div>
              )}
              {book.pageCount && (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Pages:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{book.pageCount}</span>
                </div>
              )}
              {book.publisher && (
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Publisher:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{book.publisher}</span>
                </div>
              )}
              <div className="col-span-full">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Description:</span>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{book.description}</p>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              Reviews ({Array.isArray(reviews) ? reviews.length : 0})
            </h2>

            {!Array.isArray(reviews) || reviews.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                No reviews yet. Be the first to review this book!
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <div key={review._id || index} className="border-b dark:border-gray-700 pb-4 last:border-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < (review.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Unknown date'}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{review.comment || 'No comment provided'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}

export default BookDetails;
