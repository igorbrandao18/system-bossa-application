export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  startTime: Date;
  endTime: Date;
  price: number;
  availableSeats: number;
}

export interface CreateShowtimeDTO {
  movieId: string;
  theaterId: string;
  startTime: Date;
  endTime: Date;
  price: number;
}

export interface UpdateShowtimeDTO extends Partial<CreateShowtimeDTO> {
  id: string;
} 