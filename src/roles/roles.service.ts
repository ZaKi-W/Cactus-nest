import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(
    // 注入角色仓库（操作数据库）
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // 创建角色（初始化时用，比如创建 admin 和 user 角色）
  async create(roleDto: { name: string; description?: string }): Promise<Role> {
    const role = this.roleRepository.create(roleDto);
    return await this.roleRepository.save(role);
  }

  // 根据名称查找角色
  async findOneByName(name: string): Promise<Role> {
    return await this.roleRepository.findOne({ where: { name } });
  }
}
