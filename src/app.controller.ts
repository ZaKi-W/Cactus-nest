import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './common/decorators/roles.decorator';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 需要登录 + admin 角色才能访问
  @Get('admin')
  @UseGuards(AuthGuard('jwt')) // 验证 JWT token
  @Roles('admin') // 要求 admin 角色
  getAdminInfo() {
    return '只有管理员能看到这条信息';
  }

  // 需要登录 + user/admin 角色才能访问
  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  @Roles('user', 'admin')
  getUserInfo() {
    return '普通用户/管理员都能看到这条信息';
  }
}
