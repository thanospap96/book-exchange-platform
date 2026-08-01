import React from 'react';
import type{ Book } from '../../../types/book';
import { cn } from '../../../utils/cn';

interface BookCardProps {
  book: Book;
  onBookClick?: (book: Book) => void;
  onExchangeClick?: (book: Book) => void;
  showOwner?: boolean;
  className?: string;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onBookClick,
  onExchangeClick,
  showOwner = true,
  className,
}) => {
  const getConditionColor = (condition: string) => {
    const colors = {
      excellent: 'text-green-600 bg-green-100',
      'very-good': 'text-blue-600 bg-blue-100',
      good: 'text-yellow-600 bg-yellow-100',
      fair: 'text-orange-600 bg-orange-100',
      poor: 'text-red-600 bg-red-100',
    };
    return colors[condition as keyof typeof colors] || colors.good;
  };

  const formatCondition = (condition: string) => {
    return condition.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer',
        className
      )}
      onClick={() => onBookClick?.(book)}
    >
      {/* Book Cover */}
      <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg
                className="w-16 h-16 mx-auto mb-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">No Cover</p>
            </div>
          </div>
        )}
        
        {/* Availability Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={cn(
              'px-2 py-1 text-xs font-medium rounded-full',
              book.isAvailable
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            )}
          >
            {book.isAvailable ? 'Available' : 'Unavailable'}
          </span>
        </div>
      </div>

      {/* Book Details */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-gray-600 mb-2">by {book.author}</p>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{book.genre}</span>
          <span
            className={cn(
              'px-2 py-1 text-xs font-medium rounded-full',
              getConditionColor(book.condition)
            )}
          >
            {formatCondition(book.condition)}
          </span>
        </div>

        {book.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {book.description}
          </p>
        )}

        {showOwner && book.ownerDetails && (
          <div className="flex items-center mb-3">
            <div className="w-6 h-6 bg-gray-300 rounded-full mr-2 flex items-center justify-center">
              {book.ownerDetails.avatar ? (
                <img
                  src={book.ownerDetails.avatar}
                  alt={book.ownerDetails.username}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-600">
                  {book.ownerDetails.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-600">
              {book.ownerDetails.username}
              {book.ownerDetails.location && (
                <span className="text-gray-400 ml-1">• {book.ownerDetails.location}</span>
              )}
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExchangeClick?.(book);
            }}
            disabled={!book.isAvailable}
            className="flex-1 bg-cf-dark-red text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Request Exchange
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
