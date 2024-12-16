import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Theater } from './entities/theater.entity';
import { CreateTheaterDto } from './dto/create-theater.dto';
import { UpdateTheaterDto } from './dto/update-theater.dto';
import { TheaterStatus } from './enums/theater-status.enum';

@Injectable()
export class TheatersService {
  constructor(
    @InjectRepository(Theater)
    private readonly theaterRepository: Repository<Theater>,
  ) {}

  async findAll(status?: string) {
    const query = this.theaterRepository.createQueryBuilder('theater');
    
    if (status) {
      query.where('theater.status = :status', { status });
    }
    
    return query.getMany();
  }

  async findOne(id: string) {
    const theater = await this.theaterRepository.findOne({ where: { id } });
    if (!theater) {
      throw new NotFoundException(`Theater with ID ${id} not found`);
    }
    return theater;
  }

  async create(createTheaterDto: CreateTheaterDto) {
    const theater = this.theaterRepository.create(createTheaterDto);
    return this.theaterRepository.save(theater);
  }

  async update(id: string, updateTheaterDto: UpdateTheaterDto) {
    const theater = await this.findOne(id);
    Object.assign(theater, updateTheaterDto);
    return this.theaterRepository.save(theater);
  }

  async remove(id: string) {
    const theater = await this.findOne(id);
    return this.theaterRepository.remove(theater);
  }

  async updateStatus(id: string, status: TheaterStatus) {
    const theater = await this.findOne(id);
    theater.status = status;
    return this.theaterRepository.save(theater);
  }

  async getTheaterSeats(id: string) {
    const theater = await this.findOne(id);
    return theater.seatLayout;
  }

  async updateTheaterSeats(id: string, seatLayout: any) {
    const theater = await this.findOne(id);
    theater.seatLayout = seatLayout;
    return this.theaterRepository.save(theater);
  }
} 