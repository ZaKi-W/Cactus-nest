import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  // 注册用户
  async register(userDto: {
    username: string;
    password: string;
    email?: string;
    roleName?: string; // 默认给 user 角色
  }): Promise<User> {
    // 1. 检查用户名是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username: userDto.username },
    });
    if (existingUser) {
      throw new BadRequestException('用户名已存在');
    }

    // 2. 获取角色（默认 user 角色）
    const roleName = userDto.roleName || 'user';
    const role = await this.rolesService.findOneByName(roleName);
    if (!role) {
      throw new BadRequestException(`角色 ${roleName} 不存在`);
    }

    // 3. 创建用户并关联角色
    const user = this.userRepository.create({
      username: userDto.username,
      password: userDto.password,
      email: userDto.email,
      roles: [role],
    });

    // 4. 保存用户（自动触发密码加密）
    return await this.userRepository.save(user);
  }

  // 根据用户名查找用户（含角色）
  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
      relations: ['roles'], // 关联查询角色
    });
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }
}
