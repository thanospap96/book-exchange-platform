import { useState, useEffect, useCallback } from 'react';
import type { Book, BookFormData, BookSearchParams } from '../types/book';
import { bookService } from '../services/bookService';
import { useNotification } from '../contexts/NotificationContext';

export const useBooks = (params?: BookSearchParams) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const { addNotification } = useNotification();

  const fetchBooks = useCallback(async (searchParams?: BookSearchParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await bookService.getBooks(searchParams || params);
      setBooks(response.books);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch books';
      setError(errorMessage);
      addNotification({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, [params, addNotification]);

  const createBook = async (bookData: BookFormData): Promise<Book | null> => {
    try {
      const newBook = await bookService.createBook(bookData);
      setBooks(prev => [newBook, ...prev]);
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Book created successfully',
      });
      return newBook;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create book';
      addNotification({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
      return null;
    }
  };

  const updateBook = async (id: string, bookData: Partial<BookFormData>): Promise<Book | null> => {
    try {
      const updatedBook = await bookService.updateBook(id, bookData);
      setBooks(prev => prev.map(book => book._id === id ? updatedBook : book));
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Book updated successfully',
      });
      return updatedBook;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update book';
      addNotification({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
      return null;
    }
  };

  const deleteBook = async (id: string): Promise<boolean> => {
    try {
      await bookService.deleteBook(id);
      setBooks(prev => prev.filter(book => book._id !== id));
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Book deleted successfully',
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete book';
      addNotification({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
      return false;
    }
  };

  const toggleAvailability = async (id: string): Promise<boolean> => {
    try {
      const updatedBook = await bookService.toggleBookAvailability(id);
      setBooks(prev => prev.map(book => book._id === id ? updatedBook : book));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle availability';
      addNotification({
        type: 'error',
        title: 'Error',
        message: errorMessage,
      });
      return false;
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return {
    books,
    isLoading,
    error,
    pagination,
    fetchBooks,
    createBook,
    updateBook,
    deleteBook,
    toggleAvailability,
    refetch: () => fetchBooks(),
  };
};
