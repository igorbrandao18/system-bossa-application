import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TestModule } from './test.module';
import { BookingsModule } from '../src/modules/bookings/bookings.module';
import { BookingsService } from '../src/modules/bookings/bookings.service';
import { CreateBookingDto } from '../src/modules/bookings/dto/create-booking.dto';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';
import { NotificationsService } from '../src/modules/notifications/notifications.service';
import { BookingStatus, PaymentStatus } from '../src/modules/bookings/entities/booking.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/modules/users/entities/user.entity';
import { Showtime } from '../src/modules/showtimes/entities/showtime.entity';
import { Booking } from '../src/modules/bookings/entities/booking.entity';
import { BookingSeat } from '../src/modules/bookings/entities/booking-seat.entity';
import { Repository } from 'typeorm';
import { Movie } from '../src/modules/movies/entities/movie.entity';
import { Genre } from '../src/modules/genres/entities/genre.entity';
import { UsersModule } from '../src/modules/users/users.module';
import { ShowtimesModule } from '../src/modules/showtimes/showtimes.module';
import { MoviesModule } from '../src/modules/movies/movies.module';
import { GenresModule } from '../src/modules/genres/genres.module';
import { RolesGuard } from '../src/modules/auth/guards/roles.guard';

describe('BookingsController (e2e)', () => {
  let app: INestApplication;
  let bookingsService: BookingsService;
  let userRepository: Repository<User>;
  let movieRepository: Repository<Movie>;
  let genreRepository: Repository<Genre>;
  let showtimeRepository: Repository<Showtime>;
  let testUser: User;
  let testMovie: Movie;
  let testShowtime: Showtime;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TestModule,
        BookingsModule,
        UsersModule,
        ShowtimesModule,
        MoviesModule,
        GenresModule,
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
      .overrideProvider(NotificationsService)
      .useValue({
        createBookingNotification: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    bookingsService = moduleFixture.get<BookingsService>(BookingsService);
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
    movieRepository = moduleFixture.get<Repository<Movie>>(getRepositoryToken(Movie));
    genreRepository = moduleFixture.get<Repository<Genre>>(getRepositoryToken(Genre));
    showtimeRepository = moduleFixture.get<Repository<Showtime>>(getRepositoryToken(Showtime));

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

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/bookings (POST)', () => {
    it('should create a booking', async () => {
      const createBookingDto: CreateBookingDto = {
        userId: testUser.id,
        showTimeId: testShowtime.id,
        seats: ['A1', 'A2'],
        totalAmount: 50.00,
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      };

      const response = await request(app.getHttpServer())
        .post('/bookings')
        .send(createBookingDto)
        .expect(201);

      expect(response.body).toMatchObject({
        userId: createBookingDto.userId,
        showTimeId: createBookingDto.showTimeId,
        totalAmount: createBookingDto.totalAmount,
        status: createBookingDto.status,
        paymentStatus: createBookingDto.paymentStatus,
      });

      expect(response.body.seats).toHaveLength(2);
      expect(response.body.seats[0].seatNumber).toBe('A1');
      expect(response.body.seats[1].seatNumber).toBe('A2');
    });
  });

  describe('/bookings (GET)', () => {
    it('should return all bookings', async () => {
      const response = await request(app.getHttpServer())
        .get('/bookings')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/bookings/:id (GET)', () => {
    it('should return a booking by id', async () => {
      const createBookingDto: CreateBookingDto = {
        userId: testUser.id,
        showTimeId: testShowtime.id,
        seats: ['A1'],
        totalAmount: 25.00,
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      };

      const createdBooking = await bookingsService.create(createBookingDto);

      const response = await request(app.getHttpServer())
        .get(`/bookings/${createdBooking.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: createdBooking.id,
        userId: createBookingDto.userId,
        showTimeId: createBookingDto.showTimeId,
        totalAmount: createBookingDto.totalAmount,
      });
    });

    it('should return 404 when booking not found', () => {
      return request(app.getHttpServer())
        .get(`/bookings/00000000-0000-0000-0000-000000000000`)
        .expect(404);
    });
  });

  describe('/bookings/:id/cancel (POST)', () => {
    it('should cancel a pending booking', async () => {
      const createBookingDto: CreateBookingDto = {
        userId: testUser.id,
        showTimeId: testShowtime.id,
        seats: ['A1'],
        totalAmount: 25.00,
        status: BookingStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      };

      const createdBooking = await bookingsService.create(createBookingDto);

      const response = await request(app.getHttpServer())
        .post(`/bookings/${createdBooking.id}/cancel`)
        .expect(200);

      expect(response.body.status).toBe(BookingStatus.CANCELLED);
    });

    it('should return 400 when trying to cancel a confirmed booking', async () => {
      const createBookingDto: CreateBookingDto = {
        userId: testUser.id,
        showTimeId: testShowtime.id,
        seats: ['A1'],
        totalAmount: 25.00,
        status: BookingStatus.CONFIRMED,
        paymentStatus: PaymentStatus.PAID,
      };

      const createdBooking = await bookingsService.create(createBookingDto);

      return request(app.getHttpServer())
        .post(`/bookings/${createdBooking.id}/cancel`)
        .expect(400);
    });
  });
}); 