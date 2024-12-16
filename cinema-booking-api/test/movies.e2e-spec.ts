import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TestModule } from './test.module';
import { MoviesModule } from '../src/modules/movies/movies.module';
import { MoviesService } from '../src/modules/movies/movies.service';
import { CreateMovieDto } from '../src/modules/movies/dto/create-movie.dto';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Genre } from '../src/modules/genres/entities/genre.entity';
import { Repository } from 'typeorm';
import { GenresModule } from '../src/modules/genres/genres.module';
import { RolesGuard } from '../src/modules/auth/guards/roles.guard';

describe('MoviesController (e2e)', () => {
  let app: INestApplication;
  let moviesService: MoviesService;
  let genreRepository: Repository<Genre>;
  let testGenres: Genre[];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [TestModule, MoviesModule, GenresModule],
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
    
    moviesService = moduleFixture.get<MoviesService>(MoviesService);
    genreRepository = moduleFixture.get<Repository<Genre>>(getRepositoryToken(Genre));
    
    // Criar gêneros de teste
    testGenres = await genreRepository.save([
      { name: 'Action', tmdbId: 1 } as Genre,
      { name: 'Comedy', tmdbId: 2 } as Genre,
      { name: 'Drama', tmdbId: 3 } as Genre,
    ]);
    
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/movies (POST)', () => {
    it('should create a movie', async () => {
      const createMovieDto: CreateMovieDto = {
        tmdbId: 456,
        title: 'Test Movie 2',
        originalTitle: 'Test Movie 2 Original',
        overview: 'Test Overview 2',
        releaseDate: new Date('2023-01-01'),
        genreIds: [testGenres[0].tmdbId],
      };

      const response = await request(app.getHttpServer())
        .post('/movies')
        .send(createMovieDto)
        .expect(201);

      expect(response.body).toMatchObject({
        tmdbId: createMovieDto.tmdbId,
        title: createMovieDto.title,
        originalTitle: createMovieDto.originalTitle,
        overview: createMovieDto.overview,
      });
    });
  });

  describe('/movies (GET)', () => {
    it('should return all movies', async () => {
      const response = await request(app.getHttpServer())
        .get('/movies')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('/movies/:id (GET)', () => {
    it('should return a movie by id', async () => {
      const createMovieDto: CreateMovieDto = {
        tmdbId: 789,
        title: 'Test Movie 3',
        originalTitle: 'Test Movie 3 Original',
        overview: 'Test Overview 3',
        releaseDate: new Date('2023-01-01'),
        genreIds: [testGenres[0].tmdbId],
      };

      const createdMovie = await moviesService.create(createMovieDto);

      const response = await request(app.getHttpServer())
        .get(`/movies/${createdMovie.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: createdMovie.id,
        tmdbId: createMovieDto.tmdbId,
        title: createMovieDto.title,
      });
    });

    it('should return 404 when movie not found', () => {
      return request(app.getHttpServer())
        .get(`/movies/00000000-0000-0000-0000-000000000000`)
        .expect(404);
    });
  });
}); 