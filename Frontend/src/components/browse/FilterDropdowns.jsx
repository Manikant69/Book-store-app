import React from 'react';

const SORT_OPTIONS = [
  { value: '', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Arrivals' }
];

export function FilterDropdowns({ filters, onFilterChange }) {
  return (
    <div className="flex gap-4">
      <select
        value={filters.sortBy || ''}
        onChange={(e) => {
          console.log('Sort changed to:', e.target.value);
          onFilterChange({ sortBy: e.target.value });
        }}
        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 
                 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 
                 focus:ring-teal-500"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
