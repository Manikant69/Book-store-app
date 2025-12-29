import React from 'react';
import { BookCard } from './BookCard';
import { Loader } from '../common/Loader';

export function BookGrid({ title, books, isLoading = false }) {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">{title}</h2>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader />
        </div>
      ) : books && books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No books available at the moment.</p>
        </div>
      )}
    </section>
  );
}
