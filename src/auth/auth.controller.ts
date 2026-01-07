import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 登录接口：POST /auth/login
  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return await this.authService.login(body);
  }
}
