import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TestModule } from './test.module';
import { ReportsModule } from '../src/modules/reports/reports.module';
import { Booking, BookingStatus, PaymentStatus } from '../src/modules/bookings/entities/booking.entity';
import { User } from '../src/modules/users/entities/user.entity';
import { Movie } from '../src/modules/movies/entities/movie.entity';
import { Showtime } from '../src/modules/showtimes/entities/showtime.entity';
import { BookingSeat } from '../src/modules/bookings/entities/booking-seat.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Genre } from '../src/modules/genres/entities/genre.entity';
import { UsersModule } from '../src/modules/users/users.module';
import { ShowtimesModule } from '../src/modules/showtimes/showtimes.module';
import { MoviesModule } from '../src/modules/movies/movies.module';
import { GenresModule } from '../src/modules/genres/genres.module';
import { BookingsModule } from '../src/modules/bookings/bookings.module';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../src/modules/auth/guards/roles.guard';

describe('ReportsController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let movieRepository: Repository<Movie>;
  let genreRepository: Repository<Genre>;
  let showtimeRepository: Repository<Showtime>;
  let bookingRepository: Repository<Booking>;
  let bookingSeatRepository: Repository<BookingSeat>;
  let testUser: User;
  let testMovie: Movie;
  let testShowtime: Showtime;
  let testBooking: Booking;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestModule,
        ReportsModule,
        UsersModule,
        ShowtimesModule,
        MoviesModule,
        GenresModule,
        BookingsModule,
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: (context) => {
          const request = context.switchToHttp().getRequest();
          request.user = { role: 'admin' };
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: () => true,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    movieRepository = moduleFixture.get<Repository<Movie>>(getRepositoryToken(Movie));
    genreRepository = moduleFixture.get<Repository<Genre>>(getRepositoryToken(Genre));
    showtimeRepository = moduleFixture.get<Repository<Showtime>>(getRepositoryToken(Showtime));
    bookingRepository = moduleFixture.get<Repository<Booking>>(getRepositoryToken(Booking));
    bookingSeatRepository = moduleFixture.get<Repository<BookingSeat>>(getRepositoryToken(BookingSeat));

    // Criar dados de teste
    const genre = new Genre();
    genre.name = 'Action';
    genre.tmdbId = 1;
    await genreRepository.save(genre);

    testUser = new User();
    testUser.email = 'test@example.com';
    testUser.password = 'password123';
    testUser.name = 'Test User';
    testUser.role = 'admin';
    await userRepository.save(testUser);

    testMovie = new Movie();
    testMovie.tmdbId = 123;
    testMovie.title = 'Test Movie';
    testMovie.originalTitle = 'Test Movie Original';
    testMovie.overview = 'Test Overview';
    testMovie.releaseDate = new Date('2023-01-01');
    testMovie.genres = [genre];
    await movieRepository.save(testMovie);

    testShowtime = new Showtime();
    testShowtime.movie = testMovie;
    testShowtime.movieId = testMovie.id;
    testShowtime.startTime = new Date('2024-01-01T10:00:00');
    testShowtime.endTime = new Date('2024-01-01T12:00:00');
    testShowtime.price = 25.00;
    testShowtime.availableSeats = 100;
    await showtimeRepository.save(testShowtime);

    // Criar reserva de teste
    const booking = new Booking();
    booking.user = testUser;
    booking.userId = testUser.id;
    booking.showTime = testShowtime;
    booking.showTimeId = testShowtime.id;
    booking.totalAmount = 50.00;
    booking.status = BookingStatus.CONFIRMED;
    booking.paymentStatus = PaymentStatus.PAID;
    testBooking = await bookingRepository.save(booking);

    // Criar assentos da reserva
    const bookingSeat = new BookingSeat();
    bookingSeat.seatNumber = 'A1';
    bookingSeat.price = testShowtime.price;
    bookingSeat.booking = testBooking;
    bookingSeat.bookingId = testBooking.id;
    const savedBookingSeat = await bookingSeatRepository.save(bookingSeat);

    // Atualizar reserva com assentos
    testBooking.seats = [savedBookingSeat];
    await bookingRepository.save(testBooking);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/reports/generate (POST)', () => {
    it('should generate a bookings report', () => {
      return request(app.getHttpServer())
        .post('/reports/generate')
        .send({
          type: 'bookings',
          format: 'json',
          startDate: '2023-01-01',
          endDate: '2024-12-31',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalBookings');
          expect(res.body).toHaveProperty('confirmedBookings');
          expect(res.body).toHaveProperty('cancelledBookings');
          expect(res.body).toHaveProperty('pendingBookings');
        });
    });

    it('should generate a revenue report', () => {
      return request(app.getHttpServer())
        .post('/reports/generate')
        .send({
          type: 'revenue',
          format: 'json',
          startDate: '2023-01-01',
          endDate: '2024-12-31',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalRevenue');
          expect(res.body).toHaveProperty('revenueByMovie');
          expect(res.body).toHaveProperty('bookingsCount');
          expect(res.body).toHaveProperty('averageTicketPrice');
        });
    });

    it('should generate an occupancy report', () => {
      return request(app.getHttpServer())
        .post('/reports/generate')
        .send({
          type: 'occupancy',
          format: 'json',
          startDate: '2023-01-01',
          endDate: '2024-12-31',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('totalShowTimes');
          expect(res.body).toHaveProperty('averageOccupancy');
          expect(res.body).toHaveProperty('showTimes');
        });
    });
  });
}); 