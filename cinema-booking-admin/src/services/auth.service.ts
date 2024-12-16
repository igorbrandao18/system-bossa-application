import axios from 'axios';
import api from './api';

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post('/api/admin/auth/login', {
      email,
      password
    });
    
    const data = response.data;
    
    // Save user data and token in localStorage
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.access_token);
    
    // Set the token in axios defaults
    api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
    
    return data;
  },

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  async verifyToken(): Promise<boolean> {
    try {
      const response = await api.get('/api/admin/auth/verify', {
        headers: {
          Authorization: `Bearer ${this.getToken()}`
        }
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
};