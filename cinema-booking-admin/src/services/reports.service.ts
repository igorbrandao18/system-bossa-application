import api from './api';

interface ReportFilters {
  startDate: Date;
  endDate: Date;
  type: 'SALES' | 'OCCUPANCY' | 'MOVIES';
}

interface ReportData {
  totalSales: number;
  totalBookings: number;
  averageOccupancy: number;
  topMovies: {
    movieId: string;
    title: string;
    totalBookings: number;
    totalRevenue: number;
  }[];
}

export const reportsService = {
  generate: (filters: ReportFilters) => {
    return api.post<ReportData>('/reports/generate', filters).then(response => response.data);
  }
}; 