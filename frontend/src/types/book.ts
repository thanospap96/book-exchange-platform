export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn?: string;
  description: string;
  genre: string;
  condition: BookCondition;
  coverImage?: string;
  images?: string[];
  owner: string; // User ID
  ownerDetails?: {
    username: string;
    avatar?: string;
    location?: string;
  };
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export type BookCondition = 'excellent' | 'very-good' | 'good' | 'fair' | 'poor';

export interface BookFormData {
  title: string;
  author: string;
  isbn?: string;
  description: string;
  genre: string;
  condition: BookCondition;
  coverImage?: File;
  images?: File[];
}

export interface BookFilters {
  search?: string;
  genre?: string;
  condition?: BookCondition;
  isAvailable?: boolean;
  owner?: string;
}

export interface BookSearchParams {
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'author' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  filters?: BookFilters;
}

export interface BookListResponse {
  books: Book[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
