import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { RolePermissionEntity } from './rolePermission.entity';
@Entity('Role')
export class RoleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @OneToMany(() => RolePermissionEntity, (permissions: RolePermissionEntity) => permissions.role)
  permissions!: RolePermissionEntity[];

  @OneToMany(() => UserEntity, (user: UserEntity) => user.role)
  user!: UserEntity[];
}
