import api from './api';

export interface SalesReport {
  totalRevenue: number;
  totalBookings: number;
  averageTicketPrice: number;
  salesByMovie: {
    movieId: string;
    movieTitle: string;
    totalSales: number;
    totalBookings: number;
  }[];
  salesByDay: {
    date: string;
    totalSales: number;
    totalBookings: number;
  }[];
}

export interface MovieReport {
  totalMovies: number;
  mostPopularMovies: {
    movieId: string;
    movieTitle: string;
    totalViews: number;
    rating: number;
  }[];
  genreDistribution: {
    genreId: number;
    genreName: string;
    count: number;
  }[];
}

export interface UserReport {
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsers: number;
  usersByMonth: {
    month: string;
    count: number;
  }[];
}

export interface ReportFilters {
  startDate: string;
  endDate: string;
  movieId?: string;
  theaterId?: string;
}

export const reportService = {
  getSalesReport: async (filters: ReportFilters): Promise<SalesReport> => {
    const response = await api.get('/admin/reports/sales', { params: filters });
    return response.data;
  },

  getMovieReport: async (filters: ReportFilters): Promise<MovieReport> => {
    const response = await api.get('/admin/reports/movies', { params: filters });
    return response.data;
  },

  getUserReport: async (filters: ReportFilters): Promise<UserReport> => {
    const response = await api.get('/admin/reports/users', { params: filters });
    return response.data;
  },

  exportSalesReport: async (filters: ReportFilters): Promise<Blob> => {
    const response = await api.get('/admin/reports/sales/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  exportMovieReport: async (filters: ReportFilters): Promise<Blob> => {
    const response = await api.get('/admin/reports/movies/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },

  exportUserReport: async (filters: ReportFilters): Promise<Blob> => {
    const response = await api.get('/admin/reports/users/export', {
      params: filters,
      responseType: 'blob',
    });
    return response.data;
  },
}; 