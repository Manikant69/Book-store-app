import React, { useState, useEffect } from 'react';
import { Search, Edit, Trash2, Plus, Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { useBooks } from '../../hooks/useApi';
import { LANGUAGES } from '../../data/constants';
import Toast from '../../utils/toast';

export function BooksManagement() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [genres, setGenres] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingBook, setViewingBook] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    authorName: '',
    description: '',
    price: '',
    genre: [],
    language: 'English',
    publishYear: '',
    isbn: '',
    pageCount: '',
    publisher: '',
    coverImage: null,
    inStock: true,
    rating: 0
  });
  const { getAllBooksAdmin, deleteBook, getAllGenres } = useAdmin();
  const { getAllBooks, addBook, updateBook } = useBooks();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, [searchTerm, genreFilter]);

  const fetchBooks = async () => {
    setLoading(true);
    const result = await getAllBooks(searchTerm, genreFilter, '', 1, 50);
    if (result && result.success) {
      setBooks(result.books);
    }
    setLoading(false);
  };

  const fetchGenres = async () => {
    const result = await getAllGenres();
    if (result && result.success) {
      setGenres(result.genres || []);
    } else {
      // Fallback to extracting genres from books
      const result = await getAllBooks();
      if (result && result.success) {
        const uniqueGenres = [...new Set(result.books?.flatMap(book => book.genre || []))];
        setGenres(uniqueGenres.map(name => ({ name, _id: name })));
      }
    }
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      const result = await deleteBook(bookId);
      if (result && result.success) {
        Toast.success('Book deleted successfully');
        fetchBooks();
      }
    }
  };

  const handleViewBook = (book) => {
    setViewingBook(book);
    setShowViewModal(true);
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    setFormData({
      name: book.name || '',
      authorName: book.authorName || '',
      description: book.description || '',
      price: book.price || '',
      genre: Array.isArray(book.genre) ? book.genre : [],
      language: book.language || 'English',
      publishYear: book.publishYear || '',
      isbn: book.isbn || '',
      pageCount: book.pageCount || '',
      publisher: book.publisher || '',
      coverImage: null, // Will show current image separately
      inStock: book.inStock !== undefined ? book.inStock : true,
      rating: book.rating || 0
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, files, type, checked } = e.target;
    
    if (name === 'coverImage') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (name === 'genre') {
      if (type === 'checkbox') {
        // Handle checkbox genre selection
        setFormData(prev => ({
          ...prev,
          genre: checked 
            ? [...prev.genre, value]
            : prev.genre.filter(g => g !== value)
        }));
      } else {
        // Handle multi-select (fallback)
        const selectedGenres = Array.from(e.target.selectedOptions, option => option.value);
        setFormData(prev => ({ ...prev, [name]: selectedGenres }));
      }
    } else if (name === 'inStock') {
      setFormData(prev => ({ ...prev, [name]: value === 'true' }));
    } else if (name === 'rating' || name === 'price' || name === 'publishYear' || name === 'pageCount') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.authorName || !formData.description || !formData.language) {
        Toast.error('Please fill all required fields');
        setFormLoading(false);
        return;
      }

      if (!formData.genre || formData.genre.length === 0) {
        Toast.error('Please select at least one genre');
        setFormLoading(false);
        return;
      }

      // Only require cover image for new books, not edits
      if (!editingBook && !formData.coverImage) {
        Toast.error('Cover image is required');
        setFormLoading(false);
        return;
      }

      const submitData = new FormData();
      
      // Add all required fields with correct names
      submitData.append('name', formData.name);
      submitData.append('authorName', formData.authorName);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price || '0');
      submitData.append('publishYear', formData.publishYear || new Date().getFullYear());
      submitData.append('language', formData.language);
      submitData.append('inStock', formData.inStock);
      submitData.append('rating', formData.rating || '0');
      
      // Handle genre array - send as comma-separated string
      if (formData.genre && formData.genre.length > 0) {
        submitData.append('genre', formData.genre.join(','));
      } else {
        submitData.append('genre', 'General');
      }
      
      // Add cover image only if provided
      if (formData.coverImage) {
        submitData.append('coverImage', formData.coverImage);
      }
      
      // Add optional fields if they exist
      if (formData.isbn) submitData.append('isbn', formData.isbn);
      if (formData.pageCount) submitData.append('pageCount', formData.pageCount);
      if (formData.publisher) submitData.append('publisher', formData.publisher);

      let result;
      if (editingBook) {
        result = await updateBook(editingBook._id, submitData);
      } else {
        result = await addBook(submitData);
      }

      if (result) {
        setShowAddModal(false);
        setShowEditModal(false);
        setEditingBook(null);
        setFormData({
          name: '',
          authorName: '',
          description: '',
          price: '',
          genre: [],
          language: 'English',
          publishYear: '',
          isbn: '',
          pageCount: '',
          publisher: '',
          coverImage: null,
          inStock: true,
          rating: 0
        });
        fetchBooks();
      }
    } catch (error) {
      Toast.error(`Error ${editingBook ? 'updating' : 'adding'} book`);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Books Management</h2>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add New Book
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre._id || genre} value={genre.name || genre}>
                {genre.name || genre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Books Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {books.map((book) => (
              <div key={book._id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={book.coverImage || '/placeholder-book.jpg'}
                    alt={book.name}
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {book.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      by {book.authorName}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold text-teal-600">${book.price}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        book.inStock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {book.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-3">
                      <button 
                        onClick={() => handleViewBook(book)}
                        className="text-teal-600 hover:text-teal-900 dark:text-teal-400"
                        title="View Book Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditBook(book)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400"
                        title="Edit Book"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBook(book._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400"
                        title="Delete Book"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add New Book</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter book title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    required
                    value={formData.authorName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter author name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language *
                  </label>
                  <select
                    name="language"
                    required
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Initial Rating (0-5)
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter rating"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Publication Year *
                  </label>
                  <input
                    type="number"
                    name="publishYear"
                    required
                    value={formData.publishYear}
                    onChange={handleInputChange}
                    min="1000"
                    max={new Date().getFullYear() + 5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter year"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    In Stock
                  </label>
                  <select
                    name="inStock"
                    value={formData.inStock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value={true}>In Stock</option>
                    <option value={false}>Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ISBN
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter ISBN"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Page Count
                  </label>
                  <input
                    type="number"
                    name="pageCount"
                    value={formData.pageCount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter page count"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Publisher
                  </label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter publisher"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Genres * (Select multiple by holding Ctrl/Cmd)
                </label>
                <select
                  name="genre"
                  multiple
                  required
                  value={formData.genre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  size="6"
                >
                  {genres.length > 0 ? genres.map((genre) => (
                    <option key={genre._id || genre} value={genre.name || genre}>
                      {genre.name || genre}
                    </option>
                  )) : (
                    <>
                      <option value="Fiction">Fiction</option>
                      <option value="Non-Fiction">Non-Fiction</option>
                      <option value="Science Fiction">Science Fiction</option>
                      <option value="Fantasy">Fantasy</option>
                      <option value="Mystery">Mystery</option>
                      <option value="Romance">Romance</option>
                      <option value="Biography">Biography</option>
                      <option value="History">History</option>
                      <option value="Self-Help">Self-Help</option>
                      <option value="Technology">Technology</option>
                    </>
                  )}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Hold Ctrl/Cmd and click to select multiple genres
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter book description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cover Image *
                </label>
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  required
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Upload a cover image for the book (Required)
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? 'Adding...' : 'Add Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Book Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Book</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingBook(null);
                }}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Book Title *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter book title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Author Name *
                  </label>
                  <input
                    type="text"
                    name="authorName"
                    required
                    value={formData.authorName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter author name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language *
                  </label>
                  <select
                    name="language"
                    required
                    value={formData.language}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>{lang}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter rating"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Publication Year *
                  </label>
                  <input
                    type="number"
                    name="publishYear"
                    required
                    value={formData.publishYear}
                    onChange={handleInputChange}
                    min="1000"
                    max={new Date().getFullYear() + 5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter year"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    In Stock
                  </label>
                  <select
                    name="inStock"
                    value={formData.inStock}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value={true}>In Stock</option>
                    <option value={false}>Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ISBN
                  </label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter ISBN"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Page Count
                  </label>
                  <input
                    type="number"
                    name="pageCount"
                    value={formData.pageCount}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter page count"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Publisher
                  </label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter publisher"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Genres * (Select multiple)
                </label>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 max-h-40 overflow-y-auto">
                  <div className="grid grid-cols-2 gap-2">
                    {genres.length > 0 ? genres.map((genre) => (
                      <label key={genre._id || genre} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="genre"
                          value={genre.name || genre}
                          checked={formData.genre.includes(genre.name || genre)}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {genre.name || genre}
                        </span>
                      </label>
                    )) : (
                      <>
                        {['Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 'Romance', 'Biography', 'History', 'Self-Help', 'Technology'].map((genre) => (
                          <label key={genre} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="genre"
                              value={genre}
                              checked={formData.genre.includes(genre)}
                              onChange={handleInputChange}
                              className="rounded border-gray-300 text-teal-600 focus:ring-teal-500 dark:border-gray-600"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {genre}
                            </span>
                          </label>
                        ))}
                      </>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Select one or more genres for this book
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter book description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cover Image
                </label>
                {editingBook && editingBook.coverImage && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Image:</p>
                    <img 
                      src={editingBook.coverImage} 
                      alt={editingBook.name}
                      className="w-24 h-32 object-cover rounded border"
                    />
                  </div>
                )}
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty to keep current image
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingBook(null);
                  }}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? 'Updating...' : 'Update Book'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Book Modal */}
      {showViewModal && viewingBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Book Details</h3>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setViewingBook(null);
                }}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img
                    src={viewingBook.coverImage || '/placeholder-book.jpg'}
                    alt={viewingBook.name}
                    className="w-48 h-64 object-cover rounded-lg shadow-md"
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {viewingBook.name}
                    </h4>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                      by {viewingBook.authorName}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Price:</span>
                      <span className="ml-2 text-teal-600 font-bold">${viewingBook.price}</span>
                    </div>
                    
                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Language:</span>
                      <span className="ml-2">{viewingBook.language}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Published:</span>
                      <span className="ml-2">{viewingBook.publishYear}</span>
                    </div>

                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Rating:</span>
                      <span className="ml-2">{viewingBook.rating}/5 ⭐</span>
                    </div>

                    <div>
                      <span className="font-semibold text-gray-700 dark:text-gray-300">Stock Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        viewingBook.inStock 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {viewingBook.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    {viewingBook.isbn && (
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">ISBN:</span>
                        <span className="ml-2">{viewingBook.isbn}</span>
                      </div>
                    )}

                    {viewingBook.pageCount && (
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Pages:</span>
                        <span className="ml-2">{viewingBook.pageCount}</span>
                      </div>
                    )}

                    {viewingBook.publisher && (
                      <div>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Publisher:</span>
                        <span className="ml-2">{viewingBook.publisher}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Genres:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(viewingBook.genre || []).map((g, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 rounded-full text-sm"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Description:</span>
                    <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
                      {viewingBook.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingBook(null);
                    handleEditBook(viewingBook);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Edit Book
                </button>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setViewingBook(null);
                  }}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}