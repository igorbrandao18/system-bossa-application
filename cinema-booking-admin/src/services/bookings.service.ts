import api from './api';

interface Booking {
  id: string;
  userId: string;
  showTimeId: string;
  seats: string[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
}

export const bookingsService = {
  getAll: () => {
    return api.get<Booking[]>('/admin/bookings').then(response => response.data);
  },

  getById: (id: string) => {
    return api.get<Booking>(`/admin/bookings/${id}`).then(response => response.data);
  },

  create: (data: Partial<Booking>) => {
    return api.post<Booking>('/admin/bookings', data).then(response => response.data);
  },

  update: (id: string, data: Partial<Booking>) => {
    return api.put<Booking>(`/admin/bookings/${id}`, data).then(response => response.data);
  },

  delete: (id: string) => {
    return api.delete(`/admin/bookings/${id}`);
  },

  confirm: (id: string) => {
    return api.post<Booking>(`/admin/bookings/${id}/confirm`).then(response => response.data);
  },

  cancel: (id: string) => {
    return api.post<Booking>(`/admin/bookings/${id}/cancel`).then(response => response.data);
  }
}; 