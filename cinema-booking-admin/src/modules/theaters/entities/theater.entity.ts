import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TheaterStatus } from '../enums/theater-status.enum';

@Entity('theaters')
export class Theater {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @Column({
    type: 'enum',
    enum: TheaterStatus,
    default: TheaterStatus.ACTIVE
  })
  status: TheaterStatus;

  @Column('jsonb')
  seatLayout: {
    rows: number;
    seatsPerRow: number;
    specialSeats?: Record<string, string>;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 