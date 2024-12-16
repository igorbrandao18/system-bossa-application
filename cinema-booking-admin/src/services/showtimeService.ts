import api from './api';
import { Showtime, CreateShowtimeDTO, UpdateShowtimeDTO } from '../types/showtime';

export const showtimeService = {
  getAll: async (): Promise<Showtime[]> => {
    const response = await api.get('/admin/showtimes');
    return response.data;
  },

  getById: async (id: string): Promise<Showtime> => {
    const response = await api.get(`/admin/showtimes/${id}`);
    return response.data;
  },

  create: async (data: CreateShowtimeDTO): Promise<Showtime> => {
    const response = await api.post('/admin/showtimes', data);
    return response.data;
  },

  update: async (data: UpdateShowtimeDTO): Promise<Showtime> => {
    const response = await api.put(`/admin/showtimes/${data.id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/showtimes/${id}`);
  },

  getByMovie: async (movieId: string): Promise<Showtime[]> => {
    const response = await api.get(`/admin/showtimes/movie/${movieId}`);
    return response.data;
  }
}; 