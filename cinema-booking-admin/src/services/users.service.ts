import api from './api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
}

export const usersService = {
  getAll: () => {
    return api.get<User[]>('/users').then(response => response.data);
  },

  getById: (id: string) => {
    return api.get<User>(`/users/${id}`).then(response => response.data);
  },

  create: (data: Partial<User>) => {
    return api.post<User>('/users', data).then(response => response.data);
  },

  update: (id: string, data: Partial<User>) => {
    return api.put<User>(`/users/${id}`, data).then(response => response.data);
  },

  delete: (id: string) => {
    return api.delete(`/users/${id}`);
  },

  activate: (id: string) => {
    return api.post<User>(`/users/${id}/activate`).then(response => response.data);
  },

  deactivate: (id: string) => {
    return api.post<User>(`/users/${id}/deactivate`).then(response => response.data);
  }
}; 