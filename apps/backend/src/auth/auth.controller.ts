import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserRole } from '../users/enums/role.enum';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body('email') email: string,
    @Body('role') role: UserRole,
    @Body('password') password?: string,
    @Body('firstName') firstName?: string,
    @Body('mobileNumber') mobileNumber?: string,
  ) {
    return this.authService.register(email, role, password, firstName, mobileNumber);
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password?: string,
  ) {
    return this.authService.login(email, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@Req() req) {
    return req.user;
  }
}
