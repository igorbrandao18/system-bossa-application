import api from './api';

interface Showtime {
  id: string;
  movieId: string;
  movieTitle: string;
  theaterId: string;
  theaterName: string;
  startTime: string;
  endTime: string;
  price: number;
  availableSeats: number;
}

export const showtimesService = {
  getAll: () => {
    return api.get<Showtime[]>('/admin/showtimes').then(response => response.data);
  },

  getById: (id: string) => {
    return api.get<Showtime>(`/admin/showtimes/${id}`).then(response => response.data);
  },

  create: (data: Partial<Showtime>) => {
    return api.post<Showtime>('/admin/showtimes', data).then(response => response.data);
  },

  update: (id: string, data: Partial<Showtime>) => {
    return api.put<Showtime>(`/admin/showtimes/${id}`, data).then(response => response.data);
  },

  delete: (id: string) => {
    return api.delete(`/admin/showtimes/${id}`);
  },

  getSeats: (id: string) => {
    return api.get(`/admin/showtimes/${id}/seats`).then(response => response.data);
  }
}; 