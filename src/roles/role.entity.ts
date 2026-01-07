import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';

// 标记为数据库实体，对应 roles 表
@Entity('roles')
export class Role {
  // 主键，自增
  @PrimaryGeneratedColumn()
  id: number;

  // 角色名称（如 admin、user）
  @Column({ unique: true, comment: '角色名称' })
  name: string;

  // 角色描述
  @Column({ nullable: true, comment: '角色描述' })
  description: string;

  // 多对多关联用户（一个角色对应多个用户，一个用户对应多个角色）
  @ManyToMany(() => User, (user) => user.roles)
  @JoinTable() // 主动维护关联表
  users: User[];
}
