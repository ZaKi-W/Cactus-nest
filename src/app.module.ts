import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
// 新增：导入所有子模块
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
// 新增：导入 JWT 和守卫相关
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constants';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'nest_auth',
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    }),
    RolesModule, // 角色模块
    UsersModule, // 用户模块
    AuthModule, // 认证模块
    JwtModule.register({
      // 全局 JWT 模块
      secret: jwtConstants.secret,
      global: true, // 全局可用
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // 全局注册角色守卫（可选，也可以在控制器/方法上单独用）
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
