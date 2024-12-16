import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

describe('AuthService (Integration)', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
            entities: [User],
            synchronize: true,
          }),
          inject: [ConfigService],
        }),
        UsersModule,
      ],
      providers: [
        AuthService,
        JwtService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
            verify: jest.fn().mockReturnValue({ sub: '1', email: 'test@example.com' }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);

    // Limpar usuários existentes
    try {
      const existingUser = await usersService.findByEmail('test@example.com');
      if (existingUser) {
        await usersService.remove(existingUser.id);
      }
    } catch (error) {
      // Ignore errors during cleanup
    }

    // Criar usuário de teste
    await usersService.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'test123',
      phone: '+5511999999999',
    });
  });

  afterAll(async () => {
    // Limpar dados de teste
    const user = await usersService.findByEmail('test@example.com');
    if (user) {
      await usersService.remove(user.id);
    }
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const result = await service.validateUser('test@example.com', 'test123');
      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
    });

    it('should return null when user is not found', async () => {
      const result = await service.validateUser('nonexistent@example.com', 'test123');
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const result = await service.validateUser('test@example.com', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user data when login is successful', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'test123',
      };

      const result = await service.login(loginDto);
      expect(result.access_token).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('validateToken', () => {
    it('should return decoded token when token is valid', async () => {
      const result = await service.validateToken('valid-token');
      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      jest.spyOn(jwtService, 'verify').mockImplementationOnce(() => {
        throw new Error();
      });

      await expect(service.validateToken('invalid-token')).rejects.toThrow('Invalid token');
    });
  });
}); 