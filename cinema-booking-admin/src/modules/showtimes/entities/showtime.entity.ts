import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Movie } from '../../movies/entities/movie.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('showtimes')
export class Showtime {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Movie, movie => movie.showtimes)
  movie: Movie;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  @Column('decimal')
  price: number;

  @Column()
  availableSeats: number;

  @OneToMany(() => Booking, booking => booking.showtime)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 