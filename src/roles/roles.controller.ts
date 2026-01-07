import { Controller, Post, Body } from '@nestjs/common';
import { RolesService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // 创建角色接口：POST /roles
  @Post()
  async create(@Body() body: { name: string; description?: string }) {
    return await this.rolesService.create(body);
  }
}
