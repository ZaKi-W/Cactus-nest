import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      // 从请求头的 Authorization Bearer 中提取 token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // 不忽略过期
      secretOrKey: jwtConstants.secret, // 解密密钥
    });
  }

  // 验证 token 中的用户信息
  async validate(payload: any) {
    const user = await this.usersService.findOneByUsername(payload.username);
    if (!user) {
      throw new UnauthorizedException('身份验证失败');
    }
    // 将用户信息挂载到 req.user 上
    return {
      userId: user.id,
      username: user.username,
      roles: user.roles.map((role) => role.name),
    };
  }
}
