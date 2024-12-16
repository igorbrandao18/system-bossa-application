import { IsString, IsNumber, IsEnum, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { TheaterStatus } from '../enums/theater-status.enum';

class SeatLayoutDto {
  @IsNumber()
  rows: number;

  @IsNumber()
  seatsPerRow: number;

  @IsObject()
  specialSeats?: Record<string, string>;
}

export class CreateTheaterDto {
  @IsString()
  name: string;

  @IsNumber()
  capacity: number;

  @ValidateNested()
  @Type(() => SeatLayoutDto)
  seatLayout: SeatLayoutDto;

  @IsEnum(TheaterStatus)
  status: TheaterStatus;
} 