import React from 'react';
import { useNavigate } from 'react-router-dom';

export function GenreCard({ title, imageUrl, bookCount }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to browse books page with genre filter
    navigate(`/books?genre=${encodeURIComponent(title)}`);
  };

  return (
    <div 
      className="relative group overflow-hidden rounded-xl aspect-[4/3] cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
      onClick={handleClick}
    >
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
        <p className="text-white/80 text-sm">{bookCount} Books</p>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
          <span className="text-white/90 text-sm font-medium">Click to browse →</span>
        </div>
      </div>
    </div>
  );
}
