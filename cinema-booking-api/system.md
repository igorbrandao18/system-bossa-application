# Cinema Seat Booking System

## Project Overview
A mobile application for cinema seat booking with an admin panel. The system consists of:
1. Backend API (NestJS)
2. Mobile App (React Native + Expo)
3. Admin Panel (React Native)

## Core Features

### Mobile App
1. **Authentication**
   - User registration/login using AWS Cognito
   - Profile management

2. **Movie Browsing**
   - Integration with TMDB API
   - List of current/upcoming movies
   - Movie details (synopsis, duration, rating, etc.)
   - Search and filter movies
   - Real-time movie updates

3. **Seat Booking**
   - Interactive seat selection
   - Real-time seat availability
   - Booking confirmation
   - Booking history

4. **Payment Integration**
   - Secure payment processing
   - Booking confirmation

### Admin Panel
1. **Movie Management**
   - Sync with TMDB API
   - Schedule management
   - Price configuration

2. **Seat Management**
   - Configure theater layouts
   - Mark seats as available/unavailable
   - Special seating arrangements (VIP, couples, etc.)

3. **Booking Overview**
   - View all bookings
   - Generate reports
   - Cancel/modify bookings

## Technical Requirements

### Backend (NestJS)
- RESTful API architecture
- PostgreSQL database
- TypeORM for database management
- JWT authentication
- Real-time updates using WebSockets
- TMDB API integration

### Mobile App (React Native + Expo)
- AWS Amplify integration
- AWS Cognito authentication
- TestFlight deployment
- Offline support
- Clean, modular architecture

### Common Requirements
- TypeScript
- Unit tests
- E2E tests
- Documentation
- Clean code practices
- Git version control

## Database Schema

### Movies (Synced with TMDB)
{
  id: string;
  tmdbId: number;
  title: string;
  originalTitle: string;
  overview: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: Date;
  popularity: number;
  voteAverage: number;
  voteCount: number;
  genreIds: number[];
  originalLanguage: string;
  adult: boolean;
  video: boolean;
  createdAt: Date;
  updatedAt: Date;
}

### ShowTimes
{
  id: string;
  movieId: string;
  theaterId: string;
  startTime: Date;
  endTime: Date;
  price: number;
  availableSeats: number;
}

### Theater
{
  id: string;
  name: string;
  capacity: number;
  seatLayout: SeatLayout;
  status: TheaterStatus;
}

### Seats
{
  id: string;
  row: string;
  number: number;
  type: SeatType;
  status: SeatStatus;
  theaterId: string;
  price: number;
}

### Bookings
{
  id: string;
  userId: string;
  showTimeId: string;
  seats: string[];
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

### Users
{
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  bookingHistory: string[];
  preferences: UserPreferences;
  createdAt: Date;
}

## API Endpoints

### Public
- GET /api/movies - List all movies
- GET /api/movies/:id - Get movie details
- GET /api/showtimes - List available showtimes
- GET /api/theaters - List theaters

### Protected (Requires Authentication)
- POST /api/bookings - Create new booking
- GET /api/bookings/:id - Get booking details
- GET /api/user/bookings - Get user's bookings
- PUT /api/bookings/:id - Update booking
- POST /api/user/preferences - Update user preferences

### Admin
- POST /api/admin/movies/sync - Sync movies with TMDB
- PUT /api/admin/movies/:id - Update movie
- DELETE /api/admin/movies/:id - Remove movie
- POST /api/admin/showtimes - Add showtime
- PUT /api/admin/theaters - Update theater configuration

## Environment Variables
```
# Application
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=cinema_booking

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=1d

# TMDB API
TMDB_API_KEY=c90bcc69290d26ceb456609c8e38227d
TMDB_API_BASE_URL=https://api.themoviedb.org/3
TMDB_API_LANGUAGE=pt-BR