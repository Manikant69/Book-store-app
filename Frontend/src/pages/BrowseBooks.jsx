import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { Navbar } from '../components/navbar/Navbar';
import { BrowseHeader } from '../components/browse/BrowseHeader';
import { BookGrid } from '../components/browse/BookGrid';
import { FilterSidebar } from '../components/browse/FilterSidebar';
import { useBooks } from '../hooks/useApi';
import { Footer } from '../components/layout/Footer';

function BrowseBooks() {
  const { getAllBooks } = useBooks();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    search: '',
    genre: '',
    sortBy: '',
    page: 1,
    limit: 12,
    maxPrice: 100,
    minRating: null,
    language: ''
  });

  // Update filters from URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlGenre = searchParams.get('genre');
    
    if (urlSearch || urlGenre) {
      setFilters(prev => ({ 
        ...prev, 
        search: urlSearch || prev.search,
        genre: urlGenre || prev.genre
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      console.log('=== FETCHING BOOKS ===');
      console.log('Current filters:', filters);
      
      try {
        console.log('Making API call with filters:', filters);
        
        const result = await getAllBooks(
          filters.search || '',
          filters.genre || '',
          filters.sortBy || '',
          filters.page || 1,
          filters.limit || 12,
          filters.maxPrice || null,
          filters.minRating || null,
          filters.language || ''
        );
        console.log('Filtered API result:', result);
        
        if (result && result.success) {
          console.log('Books received:', result.books?.length || 0);
          setBooks(result.books || []);
          setError(null);
        } else if (result && !result.success) {
          console.log('API returned unsuccessful result:', result);
          setBooks([]);
          setError(result.message || 'No books found');
        } else {
          console.log('No result from API');
          setBooks([]);
          setError('No books available');
        }
      } catch (error) {
        console.error('Error fetching books:', error);
        setBooks([]);
        setError('Failed to load books: ' + error.message);
      }
      
      setIsLoading(false);
    };

    fetchBooks();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    console.log('Filter change requested:', newFilters);
    setFilters(prev => {
      const updated = { ...prev, ...newFilters, page: 1 };
      console.log('Updated filters:', updated);
      return updated;
    });
  };

  if (error) {
    return (
      <>
        <Navbar/>
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-red-500 mb-4">📚 Oops!</h1>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Failed to load books</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer/>
      </>
    );
  }

  return (
    <>
      <Navbar/>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <BrowseHeader filters={filters} onFilterChange={handleFilterChange} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
          </aside>
          
          <main className="flex-1">
            <BookGrid books={books} isLoading={isLoading} error={error} />
          </main>
        </div>
      </div>
    </div>
      <Footer/>
    </>
  );
}

export default BrowseBooks;