import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    // Find user by email
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify if user is admin
    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException('Access denied. Admin only.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { 
      sub: user.id,
      email: user.email,
      role: user.role
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    };
  }

  async verify(token: string) {
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Remove 'Bearer ' from token
      const tokenValue = token.replace('Bearer ', '');
      const payload = await this.jwtService.verify(tokenValue);
      
      // Verify if user still exists and is admin
      const user = await this.usersService.findById(payload.sub);
      if (!user || user.role !== 'ADMIN') {
        throw new UnauthorizedException('Invalid token');
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
} 