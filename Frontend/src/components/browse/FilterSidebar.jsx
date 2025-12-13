import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useGenres } from '../../hooks/useApi';
import { LANGUAGES } from '../../data/constants';


export function FilterSidebar({ filters = {}, onFilterChange = () => {} }) {
  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const { getGenres } = useGenres();
  
  const {
    genre = '',
    maxPrice = 100,
    language = ''
  } = filters;

  useEffect(() => {
    const fetchGenres = async () => {
      setLoadingGenres(true);
      const result = await getGenres();
      if (result && result.success) {
        setGenres(result.genres || []);
      }
      setLoadingGenres(false);
    };

    fetchGenres();
  }, []);

  return (
    <div className="space-y-6" onClick={(e) => e.stopPropagation()}>
      {/* Clear Filters Button */}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onFilterChange({ 
            genre: '', 
            maxPrice: 100, 
            minRating: undefined, 
            language: '' 
          });
        }}
        className="w-full px-4 py-2 bg-gray-500 text-white rounded-md 
                   hover:bg-gray-600 transition-colors duration-200"
      >
        Clear All Filters
      </button>

      <div>
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Genres</h3>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={genre === ''}
              onChange={(e) => {
                console.log('All Genres checkbox clicked, current genre:', genre);
                onFilterChange({ genre: '' });
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="rounded border-gray-300 text-teal-600 
                       focus:ring-teal-500 dark:border-gray-600"
            />
            <span className="ml-2 text-gray-700 dark:text-gray-300">All Genres</span>
          </label>
          
          {loadingGenres ? (
            <div className="text-gray-500 text-sm">Loading genres...</div>
          ) : (
            genres.map((genreOption) => (
              <label key={genreOption._id} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={genre.includes(genreOption.name)}
                  onChange={(e) => {
                    console.log('Genre checkbox clicked:', genreOption.name, 'Current genre:', genre);
                    const genreArray = genre ? genre.split(',') : [];
                    let newGenres;
                    
                    if (genreArray.includes(genreOption.name)) {
                      // Remove genre if already selected
                      newGenres = genreArray.filter(g => g !== genreOption.name);
                    } else {
                      // Add genre if not selected
                      newGenres = [...genreArray, genreOption.name];
                    }
                    
                    const newGenre = newGenres.length > 0 ? newGenres.join(',') : '';
                    console.log('Setting new genre:', newGenre);
                    onFilterChange({ genre: newGenre });
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="rounded border-gray-300 text-teal-600 
                           focus:ring-teal-500 dark:border-gray-600"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">{genreOption.name}</span>
              </label>
            ))
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Price Range</h3>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="100"
            value={maxPrice}
            onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>$0</span>
            <span>${maxPrice}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Minimum Rating</h3>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Rating selected:', rating);
                onFilterChange({ minRating: rating });
              }}
              className={`p-1 rounded transition-colors ${
                (filters.minRating && rating <= filters.minRating)
                  ? 'text-yellow-400'
                  : 'text-gray-300 dark:text-gray-600 hover:text-yellow-200'
              }`}
            >
              <Star className="h-6 w-6 fill-current" />
            </button>
          ))}
          {filters.minRating && (
            <button
              type="button"
              onClick={() => onFilterChange({ minRating: null })}
              className="ml-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Language</h3>
        <select
          value={language}
          onChange={(e) => onFilterChange({ language: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 
                   dark:border-gray-700 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Languages</option>
          {LANGUAGES.map((languageOption) => (
            <option key={languageOption} value={languageOption}>
              {languageOption}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
