import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(email: string, role: UserRole) {
    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const user = this.usersRepository.create({
      email,
      role,
      isActive: true, // For MVP, normally would require email verification
    });

    await this.usersRepository.save(user);

    return {
      user,
      accessToken: this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }),
    };
  }

  async login(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // In a real Tring clone, we use Email OTP or Magic Link via Resend.
    // For now, we simulate success for existing users.
    
    return {
      user,
      accessToken: this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }),
    };
  }

  async validateUser(payload: any) {
    return this.usersRepository.findOne({ where: { id: payload.sub } });
  }
}
