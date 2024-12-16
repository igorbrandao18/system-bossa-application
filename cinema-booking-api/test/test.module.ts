import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Genre } from '../src/modules/genres/entities/genre.entity';
import { Movie } from '../src/modules/movies/entities/movie.entity';
import { User } from '../src/modules/users/entities/user.entity';
import { Showtime } from '../src/modules/showtimes/entities/showtime.entity';
import { Booking } from '../src/modules/bookings/entities/booking.entity';
import { BookingSeat } from '../src/modules/bookings/entities/booking-seat.entity';
import { Payment } from '../src/modules/payments/entities/payment.entity';
import { DataSource } from 'typeorm';
import { MoviesModule } from '../src/modules/movies/movies.module';
import { ShowtimesModule } from '../src/modules/showtimes/showtimes.module';
import { BookingsModule } from '../src/modules/bookings/bookings.module';
import { PaymentsModule } from '../src/modules/payments/payments.module';
import { UsersModule } from '../src/modules/users/users.module';
import { NotificationsModule } from '../src/modules/notifications/notifications.module';
import { ReportsModule } from '../src/modules/reports/reports.module';
import { GenresModule } from '../src/modules/genres/genres.module';
import { AuthModule } from '../src/modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.test',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE_TEST'),
        entities: [join(__dirname, '../src/**/*.entity{.ts,.js}')],
        synchronize: true,
        dropSchema: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      Genre,
      Movie,
      User,
      Showtime,
      Booking,
      BookingSeat,
      Payment,
    ]),
    MoviesModule,
    ShowtimesModule,
    BookingsModule,
    PaymentsModule,
    UsersModule,
    NotificationsModule,
    ReportsModule,
    GenresModule,
    AuthModule,
  ],
})
export class TestModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    // Garante que o banco está limpo e sincronizado
    await this.dataSource.synchronize(true);
  }
} 