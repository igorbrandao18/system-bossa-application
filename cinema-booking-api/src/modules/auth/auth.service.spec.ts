import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword123',
    name: 'Test User',
    role: 'user',
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    updateLastLogin: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser(loginDto.email, loginDto.password);
      const { password, ...expectedResult } = mockUser;

      expect(result).toEqual(expectedResult);
    });

    it('should return null when user is not found', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(loginDto.email, loginDto.password);
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));
      mockUsersService.findByEmail.mockResolvedValue(mockUser);

      const result = await service.validateUser(loginDto.email, loginDto.password);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user data when login is successful', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockToken = 'mockJwtToken';
      const { password, role, ...userWithoutPassword } = mockUser;

      jest.spyOn(service, 'validateUser').mockResolvedValue(userWithoutPassword);
      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(loginDto);

      expect(result).toEqual({
        access_token: mockToken,
        user: userWithoutPassword,
      });
      expect(mockUsersService.updateLastLogin).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });
  });

  describe('validateToken', () => {
    it('should return decoded token when token is valid', async () => {
      const mockToken = 'validToken';
      const mockDecodedToken = { sub: '1', email: 'test@example.com' };

      mockJwtService.verify.mockReturnValue(mockDecodedToken);

      const result = await service.validateToken(mockToken);
      expect(result).toEqual(mockDecodedToken);
    });

    it('should throw UnauthorizedException when token is invalid', async () => {
      const mockToken = 'invalidToken';

      mockJwtService.verify.mockImplementation(() => {
        throw new Error();
      });

      await expect(service.validateToken(mockToken)).rejects.toThrow('Invalid token');
    });
  });
}); 