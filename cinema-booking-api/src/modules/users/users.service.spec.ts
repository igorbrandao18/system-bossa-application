import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

describe('UsersService (Integration)', () => {
  let service: UsersService;
  let repository: Repository<User>;
  let module: TestingModule;
  let testUser: User;

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
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>('UserRepository');

    // Limpar todos os usuários antes dos testes
    try {
      const users = await repository.find();
      await Promise.all(users.map(user => repository.remove(user)));
    } catch (error) {
      console.log('Error cleaning up users:', error);
    }
  });

  beforeEach(async () => {
    // Criar usuário de teste com email único
    const timestamp = new Date().getTime();
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: `test${timestamp}@example.com`,
      password: 'test123',
      phone: '+5511999999999',
    };

    testUser = await service.create(createUserDto);
  });

  afterEach(async () => {
    // Limpar usuário de teste após cada teste
    if (testUser) {
      try {
        await repository.remove(testUser);
      } catch (error) {
        console.log('Error removing test user:', error);
      }
    }
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const timestamp = new Date().getTime();
      const createUserDto: CreateUserDto = {
        name: 'New User',
        email: `newuser${timestamp}@example.com`,
        password: 'test123',
        phone: '+5511999999999',
      };

      const result = await service.create(createUserDto);
      expect(result).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
      
      // Limpar usuário criado
      await repository.remove(result);
    });

    it('should throw ConflictException when email already exists', async () => {
      // Usar o mesmo email do usuário de teste criado em beforeEach
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: testUser.email, // Usar o email do usuário que já existe
        password: 'test123',
        phone: '+5511999999999',
      };

      await expect(service.create(createUserDto)).rejects.toThrow('Email already exists');
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await service.findAll();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = await service.findOne(testUser.id);
      expect(result).toBeDefined();
      expect(result.id).toBe(testUser.id);
    });

    it('should throw NotFoundException when user is not found', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      await expect(service.findOne(nonExistentId)).rejects.toThrow('User not found');
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const result = await service.findByEmail(testUser.email);
      expect(result).toBeDefined();
      expect(result.email).toBe(testUser.email);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };

      const result = await service.update(testUser.id, updateUserDto);
      expect(result.name).toBe(updateUserDto.name);
    });

    it('should update password successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        password: 'newpassword123',
      };

      const result = await service.update(testUser.id, updateUserDto);
      expect(result).toBeDefined();
      
      // Verificar se o novo password funciona
      const updatedUser = await service.findByEmail(testUser.email);
      const isValidPassword = await bcrypt.compare('newpassword123', updatedUser.password);
      expect(isValidPassword).toBe(true);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      await service.remove(testUser.id);
      await expect(service.findOne(testUser.id)).rejects.toThrow('User not found');
      testUser = null; // Prevent afterEach from trying to delete again
    });

    it('should throw NotFoundException when trying to remove non-existent user', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      await expect(service.remove(nonExistentId)).rejects.toThrow('User not found');
    });
  });

  describe('updateLastLogin', () => {
    it('should update user last login timestamp', async () => {
      const beforeUpdate = new Date();
      await service.updateLastLogin(testUser.id);
      
      const updatedUser = await service.findOne(testUser.id);
      expect(updatedUser.lastLogin).toBeDefined();
      expect(updatedUser.lastLogin.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
    });
  });
}); 