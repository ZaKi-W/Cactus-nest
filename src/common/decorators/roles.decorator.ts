import { SetMetadata } from '@nestjs/common';

// 定义元数据 key
export const ROLES_KEY = 'roles';
// 装饰器：标记接口需要的角色
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
