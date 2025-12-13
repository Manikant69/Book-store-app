import React from 'react';
import { BookCard } from '../books/BookCard';
import { Loader } from '../common/Loader';
import { EmptyState } from '../common/EmptyState';

export function BookGrid({ books, isLoading, error }) {
  console.log('BookGrid props:', { books, isLoading, error, booksLength: books?.length });
  
  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-red-500 text-lg font-semibold mb-2">Error loading books</div>
        <div className="text-gray-600 dark:text-gray-400">{error}</div>
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="text-gray-500 text-xl font-semibold mb-2">📚 No books found</div>
        <div className="text-gray-400 dark:text-gray-500 mb-4">Try adjusting your filters or search terms</div>
        <div className="text-sm text-gray-400">• Check your spelling\n• Try different keywords\n• Remove some filters</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
}
