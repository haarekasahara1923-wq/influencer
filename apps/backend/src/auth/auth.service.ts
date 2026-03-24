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

  async register(email: string, role: UserRole, password?: string, firstName?: string, mobileNumber?: string) {
    const existing = await this.usersRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const user = this.usersRepository.create({
      email,
      role,
      password: hashedPassword,
      firstName,
      mobileNumber,
      isActive: true, 
    });

    await this.usersRepository.save(user);

    return {
      user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName },
      accessToken: this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }),
    };
  }

  async login(email: string, password?: string) {
    const user = await this.usersRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'role', 'firstName'] 
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (password && user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }
    
    return {
      user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName },
      accessToken: this.jwtService.sign({ sub: user.id, email: user.email, role: user.role }),
    };
  }

  async validateUser(payload: any) {
    return this.usersRepository.findOne({ where: { id: payload.sub } });
  }
}
