import api from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  bookingHistory: string[];
  preferences: UserPreferences;
  createdAt: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface UserPreferences {
  favoriteGenres?: number[];
  notificationEnabled?: boolean;
  language?: string;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  phone: string;
  role: UserRole;
}

export interface UpdateUserDTO {
  name?: string;
  phone?: string;
  role?: UserRole;
  preferences?: UserPreferences;
}

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserDTO): Promise<User> => {
    const response = await api.post('/admin/users', data);
    return response.data;
  },

  update: async (id: string, data: UpdateUserDTO): Promise<User> => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },

  getBookingHistory: async (id: string): Promise<any[]> => {
    const response = await api.get(`/admin/users/${id}/bookings`);
    return response.data;
  },

  updatePreferences: async (
    id: string,
    preferences: UserPreferences
  ): Promise<User> => {
    const response = await api.put(`/admin/users/${id}/preferences`, preferences);
    return response.data;
  },
}; 