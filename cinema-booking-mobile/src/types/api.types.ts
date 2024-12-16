export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface Movie {
  id: string;
  tmdbId: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  popularity: number;
  voteAverage: number;
  voteCount: number;
  genreIds: number[];
  originalLanguage: string;
  adult: boolean;
  video: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  startTime: string;
  endTime: string;
  price: number;
  availableSeats: number;
}

export interface Theater {
  id: string;
  name: string;
  capacity: number;
  seatLayout: SeatLayout;
  status: TheaterStatus;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: SeatType;
  status: SeatStatus;
  theaterId: string;
  price: number;
}

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

export type SeatType = 'standard' | 'vip' | 'couple';
export type SeatStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';
export type TheaterStatus = 'active' | 'maintenance' | 'inactive';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface SeatLayout {
  rows: number;
  seatsPerRow: number;
  aisles: number[];
  vipRows: string[];
  coupleSeats: Array<{ row: string; seats: number[] }>;
} 