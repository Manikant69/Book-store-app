import React from 'react';
import { BookCard } from './BookCard';

export function BookGrid({ title, books }) {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6 dark:text-white">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </section>
  );
}
