import React from 'react';
import { GenreCard } from './GenreCard';
import { usePopularGenres } from '../../hooks/usePopularGenres';
import { Loader } from '../common/Loader';

// Fallback data in case API fails
const FALLBACK_GENRES = [
  {
    title: 'Fiction',
    imageUrl: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80',
    bookCount: 0
  },
  {
    title: 'Mystery',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
    bookCount: 0
  },
  {
    title: 'Science Fiction',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    bookCount: 0
  },
  {
    title: 'Romance',
    imageUrl: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?auto=format&fit=crop&w=800&q=80',
    bookCount: 0
  },
  {
    title: 'Biography',
    imageUrl: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?auto=format&fit=crop&w=800&q=80',
    bookCount: 0
  },
  {
    title: 'Self-Help',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    bookCount: 0
  }
];

export function PopularGenres() {
  const { genres, loading, error } = usePopularGenres(6);
  
  // Use dynamic data if available, otherwise fall back to static data
  const displayGenres = genres.length > 0 ? genres : FALLBACK_GENRES;

  if (loading) {
    return (
      <section className="py-12">
        <h2 className="text-2xl font-bold mb-8 dark:text-white">Popular Genres</h2>
        <div className="flex justify-center">
          <Loader />
        </div>
      </section>
    );
  }

  return (
    <section className="py-12">
      <h2 className="text-2xl font-bold mb-8 dark:text-white">Popular Genres</h2>
      {error && (
        <div className="mb-4 p-3 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 rounded">
          <p className="text-sm">Unable to load latest genre data. Showing default genres.</p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayGenres.map((genre) => (
          <GenreCard key={genre._id || genre.title} {...genre} />
        ))}
      </div>
    </section>
  );
}
