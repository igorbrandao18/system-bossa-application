import api from './api';

export interface Booking {
  id: string;
  userId: string;
  showTimeId: string;
  seats: string[];
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface BookingFilters {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  userId?: string;
  showTimeId?: string;
}

export const bookingService = {
  getAll: async (filters?: BookingFilters): Promise<Booking[]> => {
    const response = await api.get('/admin/bookings', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Booking> => {
    const response = await api.get(`/admin/bookings/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<Booking>): Promise<Booking> => {
    const response = await api.put(`/admin/bookings/${id}`, data);
    return response.data;
  },

  cancel: async (id: string): Promise<Booking> => {
    const response = await api.put(`/admin/bookings/${id}/cancel`);
    return response.data;
  },

  refund: async (id: string): Promise<Booking> => {
    const response = await api.post(`/admin/bookings/${id}/refund`);
    return response.data;
  },

  getStats: async (startDate: string, endDate: string) => {
    const response = await api.get('/admin/bookings/stats', {
      params: { startDate, endDate },
    });
    return response.data;
  },
}; 