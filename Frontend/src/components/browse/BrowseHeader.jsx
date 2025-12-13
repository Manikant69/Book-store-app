import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { FilterDropdowns } from './FilterDropdowns';

export function BrowseHeader({ filters, onFilterChange }) {
  return (
    <div className="sticky top-16 z-40 bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={filters.search}
                onChange={(e) => onFilterChange({ search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 
                         dark:border-gray-700 dark:bg-gray-700 dark:text-white
                         focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 rounded-lg border border-gray-200 dark:border-gray-700">
              <SlidersHorizontal className="h-5 w-5" />
            </button>
            <FilterDropdowns filters={filters} onFilterChange={onFilterChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
