import { apiClient } from './api';
import type { 
  Exchange, 
  ExchangeFormData, 
  ExchangeListResponse, 
  ExchangeSearchParams,
  Message 
} from '../types/exchange';

class ExchangeService {
  async getExchanges(params?: ExchangeSearchParams): Promise<ExchangeListResponse> {
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

    const endpoint = `/exchanges${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiClient.get<ExchangeListResponse>(endpoint);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch exchanges');
  }

  async getExchange(id: string): Promise<Exchange> {
    const response = await apiClient.get<Exchange>(`/exchanges/${id}`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch exchange');
  }

  async createExchange(exchangeData: ExchangeFormData): Promise<Exchange> {
    const response = await apiClient.post<Exchange>('/exchanges', exchangeData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to create exchange');
  }

  async updateExchangeStatus(id: string, status: string): Promise<Exchange> {
    const response = await apiClient.put<Exchange>(`/exchanges/${id}/status`, { status });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update exchange status');
  }

  async deleteExchange(id: string): Promise<void> {
    const response = await apiClient.delete(`/exchanges/${id}`);
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete exchange');
    }
  }

  async getUserExchanges(userId?: string): Promise<Exchange[]> {
    const endpoint = userId ? `/exchanges/user/${userId}` : '/exchanges/my-exchanges';
    const response = await apiClient.get<Exchange[]>(endpoint);
    
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch user exchanges');
  }

  async getExchangeMessages(exchangeId: string): Promise<Message[]> {
    const response = await apiClient.get<Message[]>(`/exchanges/${exchangeId}/messages`);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch messages');
  }

  async sendMessage(exchangeId: string, content: string): Promise<Message> {
    const response = await apiClient.post<Message>(`/exchanges/${exchangeId}/messages`, { content });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to send message');
  }
}

export const exchangeService = new ExchangeService();
