import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
// 导入角色模块（使用角色服务）
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RolesModule, // 导入角色模块
  ],
  providers: [UsersService],
  controllers: [UsersController],
  // 导出服务（供 auth 模块使用）
  exports: [UsersService],
})
export class UsersModule {}
