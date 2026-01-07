import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

@Module({
  // 导入角色实体
  imports: [TypeOrmModule.forFeature([Role])],
  // 提供角色服务
  providers: [RolesService],
  // 暴露控制器
  controllers: [RolesController],
  // 导出服务（供用户模块使用）
  exports: [RolesService],
})
export class RolesModule {}
