import api from './api';

interface Theater {
  id: string;
  name: string;
  capacity: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE';
  seatLayout: {
    rows: number;
    seatsPerRow: number;
  };
}

export const theatersService = {
  getAll: () => {
    return api.get<Theater[]>('/admin/theaters').then(response => response.data);
  },

  getById: (id: string) => {
    return api.get<Theater>(`/admin/theaters/${id}`).then(response => response.data);
  },

  create: (data: Partial<Theater>) => {
    return api.post<Theater>('/admin/theaters', data).then(response => response.data);
  },

  update: (id: string, data: Partial<Theater>) => {
    return api.put<Theater>(`/admin/theaters/${id}`, data).then(response => response.data);
  },

  delete: (id: string) => {
    return api.delete(`/admin/theaters/${id}`);
  }
}; 