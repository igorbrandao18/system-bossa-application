import api from './api';
import { authService } from './auth.service';
import { moviesService } from './movies.service';
import { bookingsService } from './bookings.service';
import { usersService } from './users.service';
import { theatersService } from './theaters.service';
import { showtimesService } from './showtimes.service';
import { reportsService } from './reports.service';
import { settingsService } from './settings.service';

// Configuração do axios para autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  auth: authService,
  movies: moviesService,
  bookings: bookingsService,
  users: usersService,
  theaters: theatersService,
  showtimes: showtimesService,
  reports: reportsService,
  settings: settingsService,
};

// Exportar a instância do axios para casos específicos
export { api }; 