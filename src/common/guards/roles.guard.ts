import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { jwtConstants } from '../../auth/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector, // 读取元数据
    private readonly jwtService: JwtService, // JWT 解析
  ) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. 获取接口需要的角色
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [
        context.getHandler(), // 方法级别的元数据
        context.getClass(), // 控制器级别的元数据
      ],
    );

    // 2. 如果没有要求角色，直接放行
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // 3. 获取请求对象
    const request = context.switchToHttp().getRequest();
    const user = request.user; // JWT 验证后挂载的用户信息

    // 4. 验证用户角色
    if (!user || !user.roles) {
      throw new UnauthorizedException('无访问权限');
    }

    // 5. 检查用户是否有要求的角色
    const hasRole = user.roles.some((role) => requiredRoles.includes(role));
    if (!hasRole) {
      throw new UnauthorizedException(`需要角色：${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
