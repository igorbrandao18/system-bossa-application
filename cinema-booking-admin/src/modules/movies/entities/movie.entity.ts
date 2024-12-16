import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Showtime } from '../../showtimes/entities/showtime.entity';

@Entity('movies')
export class Movie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tmdbId: number;

  @Column()
  title: string;

  @Column()
  originalTitle: string;

  @Column('text')
  overview: string;

  @Column()
  posterPath: string;

  @Column()
  backdropPath: string;

  @Column()
  releaseDate: Date;

  @Column('decimal')
  popularity: number;

  @Column('decimal')
  voteAverage: number;

  @Column()
  voteCount: number;

  @Column('simple-array')
  genreIds: number[];

  @Column()
  originalLanguage: string;

  @Column()
  adult: boolean;

  @Column()
  video: boolean;

  @OneToMany(() => Showtime, showtime => showtime.movie)
  showtimes: Showtime[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 