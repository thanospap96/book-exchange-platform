import { apiClient } from './api';
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User, 
  UpdateProfileData 
} from '../types/user';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
      return response.data;
    }
    throw new Error(response.message || 'Login failed');
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/auth/register', userData);
    if (response.success && response.data) {
      apiClient.setToken(response.data.token);
      return response.data;
    }
    throw new Error(response.message || 'Registration failed');
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiClient.setToken(null);
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/auth/me');
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to get user data');
  }

  async updateProfile(userData: UpdateProfileData): Promise<User> {
    const formData = new FormData();
    
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value);
      }
    });

    const response = await apiClient.upload<User>('/auth/profile', formData);
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Profile update failed');
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    const response = await apiClient.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    if (!response.success) {
      throw new Error(response.message || 'Password change failed');
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}

export const authService = new AuthService();
