export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  booksCount: number;
  exchangesCount: number;
  rating?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  avatar?: File;
}
