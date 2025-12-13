import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from './BookCard';


export default function BookCarousel({ name, books }) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const itemsPerPage = 4;

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerPage >= books.length ? 0 : prev + itemsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - itemsPerPage < 0 ? Math.max(0, books.length - itemsPerPage) : prev - itemsPerPage
    );
  };

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold dark:text-white">{name}</h2>
        <div className="flex space-x-2">
          <button
            onClick={prevSlide}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books
            .slice(currentIndex, currentIndex + itemsPerPage)
            .map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
        </div>
      </div>
    </div>
  );
}