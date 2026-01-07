import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  BeforeInsert,
} from 'typeorm';
import { Role } from '../roles/role.entity';
// 密码加密工具
import * as bcrypt from 'bcryptjs';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  // 用户名，唯一
  @Column({ unique: true, comment: '用户名' })
  username: string;

  // 密码（加密存储）
  @Column({ comment: '密码' })
  password: string;

  // 邮箱（可选）
  @Column({ nullable: true, comment: '邮箱' })
  email: string;

  // 多对多关联角色
  @ManyToMany(() => Role, (role) => role.users)
  roles: Role[];

  // 插入数据库前自动加密密码
  @BeforeInsert()
  async encryptPassword() {
    // 加盐加密，10 是加盐强度
    this.password = await bcrypt.hash(this.password, 10);
  }

  // 验证密码是否正确
  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
