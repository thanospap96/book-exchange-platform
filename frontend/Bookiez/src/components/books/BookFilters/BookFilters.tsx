import React from 'react';
import type { BookFilters as BookFiltersType, BookCondition } from '../../../types/book';
import Input from '../../ui/Input/Input';
import Button from '../../ui/Button/Button';

interface BookFiltersProps {
  filters: BookFiltersType;
  onFiltersChange: (filters: BookFiltersType) => void;
  onReset: () => void;
  className?: string;
}

const BookFilters: React.FC<BookFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
  className,
}) => {
  const genres = [
    'Fiction',
    'Non-Fiction',
    'Mystery',
    'Romance',
    'Science Fiction',
    'Fantasy',
    'Thriller',
    'Biography',
    'History',
    'Self-Help',
    'Business',
    'Health',
    'Travel',
    'Cooking',
    'Art',
    'Other',
  ];

  const conditions: { value: BookCondition; label: string }[] = [
    { value: 'excellent', label: 'Excellent' },
    { value: 'very-good', label: 'Very Good' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' },
  ];

  const handleFilterChange = (key: keyof BookFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== null && value !== ''
  );

  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Search */}
        <Input
          label="Search"
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          placeholder="Search by title or author..."
        />

        {/* Genre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Genre
          </label>
          <select
            value={filters.genre || ''}
            onChange={(e) => handleFilterChange('genre', e.target.value || undefined)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cf-dark-red focus:border-cf-dark-red sm:text-sm"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condition
          </label>
          <select
            value={filters.condition || ''}
            onChange={(e) => handleFilterChange('condition', e.target.value || undefined)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cf-dark-red focus:border-cf-dark-red sm:text-sm"
          >
            <option value="">All Conditions</option>
            {conditions.map(condition => (
              <option key={condition.value} value={condition.value}>
                {condition.label}
              </option>
            ))}
          </select>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Availability
          </label>
          <select
            value={filters.isAvailable === undefined ? '' : filters.isAvailable.toString()}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('isAvailable', value === '' ? undefined : value === 'true');
            }}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cf-dark-red focus:border-cf-dark-red sm:text-sm"
          >
            <option value="">All Books</option>
            <option value="true">Available Only</option>
            <option value="false">Unavailable Only</option>
          </select>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters:</h4>
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: {filters.search}
                <button
                  onClick={() => handleFilterChange('search', undefined)}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                >
                  ×
                </button>
              </span>
            )}
            {filters.genre && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Genre: {filters.genre}
                <button
                  onClick={() => handleFilterChange('genre', undefined)}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-green-200"
                >
                  ×
                </button>
              </span>
            )}
            {filters.condition && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Condition: {conditions.find(c => c.value === filters.condition)?.label}
                <button
                  onClick={() => handleFilterChange('condition', undefined)}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-yellow-200"
                >
                  ×
                </button>
              </span>
            )}
            {filters.isAvailable !== undefined && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Availability: {filters.isAvailable ? 'Available' : 'Unavailable'}
                <button
                  onClick={() => handleFilterChange('isAvailable', undefined)}
                  className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-purple-200"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookFilters;
