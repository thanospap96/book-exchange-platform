import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import { useBooks } from '../../hooks/useBooks';
import type { BookFilters as BookFiltersType } from '../../types/book';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../contexts/NotificationContext';
import BookCard from '../../components/books/BookCard/BookCard';
import BookForm from '../../components/books/BookForm/BookForm';
import BookFilters from '../../components/books/BookFilters/BookFilters';
import Button from '../../components/ui/Button/Button';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';

const BookList: React.FC = () => {
  const [showBookForm, setShowBookForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<BookFiltersType>({});
  const [selectedBook, setSelectedBook] = useState<any>(null);

  const { isAuthenticated } = useAuth();
  const { addNotification } = useNotification();
  
  const {
    books,
    isLoading,
    error,
    pagination,
    createBook,
    updateBook,
    fetchBooks,
  } = useBooks({ filters });

  const handleBookClick = (book: any) => {
    // Navigate to book details or open book modal
    console.log('Book clicked:', book);
  };

  const handleExchangeClick = (book: any) => {
    if (!isAuthenticated) {
      addNotification({
        type: 'warning',
        title: 'Authentication Required',
        message: 'Please log in to request book exchanges.',
      });
      return;
    }
    // Navigate to exchange request or open exchange modal
    console.log('Exchange clicked:', book);
  };

  const handleCreateBook = async (bookData: any) => {
    await createBook(bookData);
    setShowBookForm(false);
  };

  const handleUpdateBook = async (bookData: any) => {
    if (selectedBook) {
      await updateBook(selectedBook._id, bookData);
      setShowBookForm(false);
      setSelectedBook(null);
    }
  };

  const handleFiltersChange = (newFilters: BookFiltersType) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({});
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Books</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => fetchBooks()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Books</h1>
            <p className="text-gray-600 mt-2">
              Discover and exchange books with fellow readers
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              Filters
            </Button>
            
            {isAuthenticated && (
              <Button
                onClick={() => setShowBookForm(true)}
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Book
              </Button>
            )}
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-8">
            <BookFilters
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onReset={handleResetFilters}
            />
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Books Grid */}
        {!isLoading && (
          <>
            {books.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  No books found
                </h2>
                <p className="text-gray-600 mb-6">
                  {Object.keys(filters).length > 0
                    ? 'Try adjusting your filters to see more books.'
                    : 'Be the first to add a book to the collection!'}
                </p>
                {isAuthenticated && (
                  <Button onClick={() => setShowBookForm(true)}>
                    Add Your First Book
                  </Button>
                )}
              </div>
            ) : (
              <>
                {/* Results Count */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    Showing {books.length} of {pagination.total} books
                  </p>
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {books.map((book) => (
                    <BookCard
                      key={book._id}
                      book={book}
                      onBookClick={handleBookClick}
                      onExchangeClick={handleExchangeClick}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page === 1}
                        onClick={() => fetchBooks({ ...filters, page: pagination.page - 1 })}
                      >
                        Previous
                      </Button>
                      
                      <span className="px-4 py-2 text-sm text-gray-600">
                        Page {pagination.page} of {pagination.totalPages}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => fetchBooks({ ...filters, page: pagination.page + 1 })}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Book Form Modal */}
        <BookForm
          isOpen={showBookForm}
          onClose={() => {
            setShowBookForm(false);
            setSelectedBook(null);
          }}
          onSubmit={selectedBook ? handleUpdateBook : handleCreateBook}
          initialData={selectedBook}
        />
      </div>
    </div>
  );
};

export default BookList;
