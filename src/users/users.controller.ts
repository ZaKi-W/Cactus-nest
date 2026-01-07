import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 注册接口：POST /users/register
  @Post('register')
  async register(
    @Body()
    body: {
      username: string;
      password: string;
      email?: string;
      roleName?: string;
    },
  ) {
    const user = await this.usersService.register(body);
    // 返回用户信息时隐藏密码
    const { password, ...result } = user;
    return result;
  }
}
