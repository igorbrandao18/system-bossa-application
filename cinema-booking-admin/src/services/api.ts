import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

// Log the API configuration
console.log('API Base URL:', api.defaults.baseURL);

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Log the request configuration
  console.log('API Request:', {
    method: config.method,
    url: config.url,
    params: config.params,
    headers: config.headers
  });
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Log the response
    console.log('API Response:', {
      status: response.status,
      data: response.data,
      url: response.config.url
    });
    return response;
  },
  (error) => {
    // Log the error
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url
    });
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await api.post('/api/admin/auth/login', { email, password });
      return response.data;
    },
  },

  movies: {
    getAll: async (page = 1, limit = 20) => {
      const response = await api.get('/api/admin/movies', {
        params: { page, limit }
      });
      console.log('Movies API Response:', response.data);
      return response.data;
    },
    getById: async (id: string) => {
      const response = await api.get(`/api/admin/movies/${id}`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/api/admin/movies', data);
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await api.put(`/api/admin/movies/${id}`, data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await api.delete(`/api/admin/movies/${id}`);
      return response.data;
    },
    sync: async () => {
      const response = await api.post('/api/admin/movies/sync');
      return response.data;
    },
  },

  theaters: {
    getAll: async () => {
      try {
        const response = await api.get('/api/admin/theaters');
        return response.data;
      } catch (error: any) {
        console.error('Failed to fetch theaters:', error.response?.data || error.message);
        throw error;
      }
    },
    getById: async (id: string) => {
      try {
        const response = await api.get(`/api/admin/theaters/${id}`);
        return response.data;
      } catch (error: any) {
        console.error(`Failed to fetch theater ${id}:`, error.response?.data || error.message);
        throw error;
      }
    },
    create: async (data: any) => {
      try {
        const response = await api.post('/api/admin/theaters', data);
        return response.data;
      } catch (error: any) {
        console.error('Failed to create theater:', error.response?.data || error.message);
        throw error;
      }
    },
    update: async (id: string, data: any) => {
      try {
        const response = await api.put(`/api/admin/theaters/${id}`, data);
        return response.data;
      } catch (error: any) {
        console.error(`Failed to update theater ${id}:`, error.response?.data || error.message);
        throw error;
      }
    },
    delete: async (id: string) => {
      try {
        const response = await api.delete(`/api/admin/theaters/${id}`);
        return response.data;
      } catch (error: any) {
        console.error(`Failed to delete theater ${id}:`, error.response?.data || error.message);
        throw error;
      }
    },
  },

  showtimes: {
    getAll: async () => {
      const response = await api.get('/api/admin/showtimes');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await api.get(`/api/admin/showtimes/${id}`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/api/admin/showtimes', data);
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await api.put(`/api/admin/showtimes/${id}`, data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await api.delete(`/api/admin/showtimes/${id}`);
      return response.data;
    },
  },

  bookings: {
    getAll: async () => {
      const response = await api.get('/api/admin/bookings');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await api.get(`/api/admin/bookings/${id}`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/api/admin/bookings', data);
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await api.put(`/api/admin/bookings/${id}`, data);
      return response.data;
    },
    cancel: async (id: string) => {
      const response = await api.post(`/api/admin/bookings/${id}/cancel`);
      return response.data;
    },
  },

  users: {
    getAll: async () => {
      const response = await api.get('/api/admin/users');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await api.get(`/api/admin/users/${id}`);
      return response.data;
    },
    create: async (data: any) => {
      const response = await api.post('/api/admin/users', data);
      return response.data;
    },
    update: async (id: string, data: any) => {
      const response = await api.put(`/api/admin/users/${id}`, data);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await api.delete(`/api/admin/users/${id}`);
      return response.data;
    },
  },

  reports: {
    generate: async (filters: any) => {
      const response = await api.get('/api/admin/reports', { params: filters });
      return response.data;
    },
  },

  settings: {
    getAll: async () => {
      const response = await api.get('/api/admin/settings');
      return response.data;
    },
    update: async (data: any) => {
      const response = await api.put('/api/admin/settings', data);
      return response.data;
    },
  },

  genres: {
    getAll: () => api.get('/api/admin/genres').then(response => response.data),
    getById: (id: string) => api.get(`/api/admin/genres/${id}`).then(response => response.data),
    create: (data: any) => api.post('/api/admin/genres', data).then(response => response.data),
    update: (id: string, data: any) => api.put(`/api/admin/genres/${id}`, data).then(response => response.data),
    delete: (id: string) => api.delete(`/api/admin/genres/${id}`).then(response => response.data),
  },
};

export default api; 