import api from './api';

interface Movie {
  id: string;
  tmdbId: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  popularity: number | null;
  voteAverage: number | null;
  voteCount: number;
  genreIds: string[];
  originalLanguage: string;
  adult: boolean;
  video: boolean;
  genres: Genre[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

interface Genre {
  id: string;
  tmdbId: number;
  name: string;
}

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const moviesService = {
  getAll: (page = 1, limit = 20) => {
    return api.get<PaginatedResponse<Movie>>('/admin/movies', {
      params: { page, limit }
    }).then(response => response.data);
  },

  getById: (id: string) => {
    return api.get<Movie>(`/admin/movies/${id}`).then(response => response.data);
  },

  create: (data: Partial<Movie>) => {
    return api.post<Movie>('/admin/movies', data).then(response => response.data);
  },

  update: (id: string, data: Partial<Movie>) => {
    return api.put<Movie>(`/admin/movies/${id}`, data).then(response => response.data);
  },

  delete: (id: string) => {
    return api.delete(`/admin/movies/${id}`);
  },

  sync: () => {
    return api.post('/admin/movies/sync').then(response => response.data);
  },

  getGenres: () => {
    return api.get<Genre[]>('/admin/movies/genres').then(response => response.data);
  }
}; 