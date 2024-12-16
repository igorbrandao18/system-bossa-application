import api from './api';

export interface Movie {
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
  genres: {
    id: string;
    name: string;
  }[];
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateMovieDTO {
  tmdbId: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const movieService = {
  getAll: async (page: number = 1, limit: number = 20): Promise<Movie[]> => {
    try {
      console.log('Fetching movies with params:', { page, limit });
      const response = await api.get<PaginatedResponse<Movie> | Movie[]>('/movies', {
        params: {
          page,
          limit,
        }
      });
      console.log('API Response:', response.data);

      // Handle both paginated and non-paginated responses
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return (response.data as PaginatedResponse<Movie>).data || [];
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw new Error('Não foi possível carregar os filmes. Tente novamente mais tarde.');
    }
  },

  getById: async (id: string): Promise<Movie> => {
    try {
      const response = await api.get<Movie>(`/movies/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie:', error);
      throw new Error('Não foi possível carregar o filme. Tente novamente mais tarde.');
    }
  },

  create: async (data: CreateMovieDTO): Promise<Movie> => {
    try {
      const response = await api.post<Movie>('/admin/movies', data);
      return response.data;
    } catch (error) {
      console.error('Error creating movie:', error);
      throw new Error('Não foi possível adicionar o filme. Tente novamente mais tarde.');
    }
  },

  update: async (id: string, data: Partial<Movie>): Promise<Movie> => {
    try {
      const response = await api.put<Movie>(`/admin/movies/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating movie:', error);
      throw new Error('Não foi possível atualizar o filme. Tente novamente mais tarde.');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/admin/movies/${id}`);
    } catch (error) {
      console.error('Error deleting movie:', error);
      throw new Error('Não foi possível remover o filme. Tente novamente mais tarde.');
    }
  },

  syncWithTMDB: async (): Promise<void> => {
    try {
      await api.post('/admin/movies/sync');
    } catch (error) {
      console.error('Error syncing with TMDB:', error);
      throw new Error('Não foi possível sincronizar com o TMDB. Tente novamente mais tarde.');
    }
  },

  searchTMDB: async (query: string, page: number = 1): Promise<Movie[]> => {
    try {
      const response = await api.get<PaginatedResponse<Movie> | Movie[]>(`/admin/movies/tmdb/search`, {
        params: {
          query,
          page,
        }
      });

      // Handle both paginated and non-paginated responses
      if (Array.isArray(response.data)) {
        return response.data;
      }
      return (response.data as PaginatedResponse<Movie>).data || [];
    } catch (error) {
      console.error('Error searching TMDB:', error);
      throw new Error('Não foi possível pesquisar filmes. Tente novamente mais tarde.');
    }
  },
}; 