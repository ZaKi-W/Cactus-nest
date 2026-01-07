import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
// 注意：这里不再需要导入 jwtConstants（因为模块已配置）

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // 登录逻辑
  async login(loginDto: { username: string; password: string }) {
    // 1. 查找用户
    const user = await this.usersService.findOneByUsername(loginDto.username);

    // 2. 验证密码
    const isPasswordValid = await user.validatePassword(loginDto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('密码错误');
    }

    // 3. 生成 JWT token（关键修复：只传 payload，不用传 secret/expiresIn）
    const payload = {
      username: user.username,
      roles: user.roles.map((role) => role.name),
    };

    return {
      // 直接调用 sign(payload)，签名选项在 auth.module.ts 里已配置
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles.map((role) => role.name),
      },
    };
  }
}
