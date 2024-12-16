import api from './api';

export interface Theater {
  id: string;
  name: string;
  capacity: number;
  seatLayout: SeatLayout;
  status: TheaterStatus;
}

export interface SeatLayout {
  rows: number;
  seatsPerRow: number;
  seats: Seat[];
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: SeatType;
  status: SeatStatus;
  price: number;
}

export enum SeatType {
  STANDARD = 'STANDARD',
  VIP = 'VIP',
  WHEELCHAIR = 'WHEELCHAIR',
  COUPLE = 'COUPLE',
}

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
}

export enum TheaterStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
}

export interface CreateTheaterDTO {
  name: string;
  capacity: number;
  seatLayout: Omit<SeatLayout, 'seats'>;
}

export const theaterService = {
  getAll: async (): Promise<Theater[]> => {
    const response = await api.get('/admin/theaters');
    return response.data;
  },

  getById: async (id: string): Promise<Theater> => {
    const response = await api.get(`/admin/theaters/${id}`);
    return response.data;
  },

  create: async (data: CreateTheaterDTO): Promise<Theater> => {
    const response = await api.post('/admin/theaters', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Theater>): Promise<Theater> => {
    const response = await api.put(`/admin/theaters/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/theaters/${id}`);
  },

  updateSeat: async (
    theaterId: string,
    seatId: string,
    data: Partial<Seat>
  ): Promise<Seat> => {
    const response = await api.put(
      `/admin/theaters/${theaterId}/seats/${seatId}`,
      data
    );
    return response.data;
  },

  updateStatus: async (
    id: string,
    status: TheaterStatus
  ): Promise<Theater> => {
    const response = await api.put(`/admin/theaters/${id}/status`, { status });
    return response.data;
  },
}; 