export interface Exchange {
  _id: string;
  requester: string; // User ID
  requesterDetails?: {
    username: string;
    avatar?: string;
  };
  bookOwner: string; // User ID
  bookOwnerDetails?: {
    username: string;
    avatar?: string;
  };
  requestedBook: string; // Book ID
  requestedBookDetails?: {
    title: string;
    author: string;
    coverImage?: string;
  };
  offeredBook?: string; // Book ID (optional)
  offeredBookDetails?: {
    title: string;
    author: string;
    coverImage?: string;
  };
  status: ExchangeStatus;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export type ExchangeStatus = 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';

export interface Message {
  _id: string;
  sender: string; // User ID
  senderDetails?: {
    username: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  exchangeId: string;
}

export interface ExchangeFormData {
  requestedBook: string;
  offeredBook?: string;
  message?: string;
}

export interface ExchangeFilters {
  status?: ExchangeStatus;
  requester?: string;
  bookOwner?: string;
}

export interface ExchangeSearchParams {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  filters?: ExchangeFilters;
}

export interface ExchangeListResponse {
  exchanges: Exchange[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
