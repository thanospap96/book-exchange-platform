import { apiClient } from './api';
import type { 
  Book, 
  BookFormData, 
  BookListResponse, 
  BookSearchParams 
} from '../types/book';

class BookService {
  async getBooks(params?: BookSearchParams): Promise<BookListResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    if (params?.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const endpoint = `/books${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get<BookListResponse>(endpoint);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch books');
  }

  async getBook(id: string): Promise<Book> {
    const response = await apiClient.get<Book>(`/books/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch book');
  }

  async createBook(bookData: BookFormData): Promise<Book> {
    const formData = new FormData();
    
    Object.entries(bookData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'images' && Array.isArray(value)) {
          value.forEach((file) => {
            formData.append(`images`, file);
          });
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await apiClient.upload<Book>('/books', formData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create book');
  }

  async updateBook(id: string, bookData: Partial<BookFormData>): Promise<Book> {
    const formData = new FormData();
    
    Object.entries(bookData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'images' && Array.isArray(value)) {
          value.forEach((file) => {
            formData.append(`images`, file);
          });
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await apiClient.upload<Book>(`/books/${id}`, formData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update book');
  }

  async deleteBook(id: string): Promise<void> {
    const response = await apiClient.delete(`/books/${id}`);
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete book');
    }
  }

  async getUserBooks(userId?: string): Promise<Book[]> {
    const endpoint = userId ? `/books/user/${userId}` : '/books/my-books';
    const response = await apiClient.get<Book[]>(endpoint);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch user books');
  }

  async toggleBookAvailability(id: string): Promise<Book> {
    const response = await apiClient.put<Book>(`/books/${id}/toggle-availability`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to toggle book availability');
  }
}

export const bookService = new BookService();
