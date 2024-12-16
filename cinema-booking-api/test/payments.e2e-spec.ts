import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TestModule } from './test.module';
import { PaymentsModule } from '../src/modules/payments/payments.module';
import { PaymentsService } from '../src/modules/payments/payments.service';
import { CreatePaymentDto } from '../src/modules/payments/dto/create-payment.dto';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';
import { NotificationsService } from '../src/modules/notifications/notifications.service';
import { PaymentMethod, PaymentStatus } from '../src/modules/payments/entities/payment.entity';
import { v4 as uuidv4 } from 'uuid';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/modules/users/entities/user.entity';
import { Showtime } from '../src/modules/showtimes/entities/showtime.entity';
import { Booking, BookingStatus } from '../src/modules/bookings/entities/booking.entity';
import { BookingSeat } from '../src/modules/bookings/entities/booking-seat.entity';
import { Repository } from 'typeorm';
import { Movie } from '../src/modules/movies/entities/movie.entity';
import { Genre } from '../src/modules/genres/entities/genre.entity';
import { UsersModule } from '../src/modules/users/users.module';
import { ShowtimesModule } from '../src/modules/showtimes/showtimes.module';
import { MoviesModule } from '../src/modules/movies/movies.module';
import { GenresModule } from '../src/modules/genres/genres.module';
import { BookingsModule } from '../src/modules/bookings/bookings.module';
import { RolesGuard } from '../src/modules/auth/guards/roles.guard';

describe('PaymentsController (e2e)', () => {
  let app: INestApplication;
  let paymentsService: PaymentsService;
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
        PaymentsModule,
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
      .overrideProvider(NotificationsService)
      .useValue({
        createPaymentNotification: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    paymentsService = moduleFixture.get<PaymentsService>(PaymentsService);
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
    booking.status = BookingStatus.PENDING;
    booking.paymentStatus = PaymentStatus.PENDING;
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

  describe('/payments (POST)', () => {
    it('should create a payment', async () => {
      const createPaymentDto: CreatePaymentDto = {
        bookingId: testBooking.id,
        amount: 50.00,
        method: PaymentMethod.CREDIT_CARD,
        paymentIntentId: 'pi_' + uuidv4(),
      };

      const response = await request(app.getHttpServer())
        .post('/payments')
        .send(createPaymentDto)
        .expect(201);

      expect(response.body).toMatchObject({
        bookingId: createPaymentDto.bookingId,
        amount: createPaymentDto.amount,
        method: createPaymentDto.method,
        paymentIntentId: createPaymentDto.paymentIntentId,
        status: PaymentStatus.PENDING,
      });
    });

    it('should throw BadRequestException when payment amount does not match booking amount', async () => {
      const createPaymentDto: CreatePaymentDto = {
        bookingId: testBooking.id,
        amount: 100.00, // Different from booking amount (50.00)
        method: PaymentMethod.CREDIT_CARD,
        paymentIntentId: 'pi_' + uuidv4(),
      };

      return request(app.getHttpServer())
        .post('/payments')
        .send(createPaymentDto)
        .expect(400);
    });
  });

  describe('/payments/:id/process (POST)', () => {
    it('should process a payment', async () => {
      const createPaymentDto: CreatePaymentDto = {
        bookingId: testBooking.id,
        amount: 50.00,
        method: PaymentMethod.CREDIT_CARD,
        paymentIntentId: 'pi_' + uuidv4(),
      };

      const createdPayment = await paymentsService.create(createPaymentDto);

      const response = await request(app.getHttpServer())
        .post(`/payments/${createdPayment.id}/process`)
        .expect(200);

      expect(response.body.status).toBe(PaymentStatus.COMPLETED);
    });
  });

  describe('/payments/:id/refund (POST)', () => {
    it('should refund a payment', async () => {
      const createPaymentDto: CreatePaymentDto = {
        bookingId: testBooking.id,
        amount: 50.00,
        method: PaymentMethod.CREDIT_CARD,
        paymentIntentId: 'pi_' + uuidv4(),
      };

      const createdPayment = await paymentsService.create(createPaymentDto);
      await paymentsService.processPayment(createdPayment.id);

      const response = await request(app.getHttpServer())
        .post(`/payments/${createdPayment.id}/refund`)
        .expect(200);

      expect(response.body.status).toBe(PaymentStatus.REFUNDED);
    });
  });
}); 