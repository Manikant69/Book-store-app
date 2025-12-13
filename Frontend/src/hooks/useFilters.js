import { useState, useMemo } from 'react';

const initialFilters = {
  search: '',
  genres: [],
  maxPrice: 100,
  minRating: 0,
  language: '',
  sort: 'popular'
};

export function useFilters(books) {
  const [filters, setFilters] = useState(initialFilters);

  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        const matchesSearch = !filters.search ||
          book.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          book.author.toLowerCase().includes(filters.search.toLowerCase());

        const matchesGenres = filters.genres.length === 0 ||
          filters.genres.some((genre) => book.genre.includes(genre));

        const matchesPrice = book.price <= filters.maxPrice;

        const matchesRating = book.rating >= filters.minRating;

        const matchesLanguage = !filters.language ||
          book.language === filters.language;

        return (
          matchesSearch &&
          matchesGenres &&
          matchesPrice &&
          matchesRating &&
          matchesLanguage
        );
      })
      .sort((a, b) => {
        switch (filters.sort) {
          case 'price_low':
            return a.price - b.price;
          case 'price_high':
            return b.price - a.price;
          case 'rating':
            return b.rating - a.rating;
          case 'newest':
            return b.publicationYear - a.publicationYear;
          default:
            return 0;
        }
      });
  }, [books, filters]);

  return { filters, setFilters, filteredBooks };
}
