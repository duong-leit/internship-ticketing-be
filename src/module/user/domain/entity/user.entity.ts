import { GenderEnum } from '../enum/gender.enum';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { RoleEntity } from 'src/module/auth/domain/entity/role.entity';
import { AppBaseEntity } from 'src/common/entity/entity';
import { EventEntity } from 'src/module/event/domain/entity/event.entity';
import { OrderEntity } from 'src/module/payment/domain/entity/order.entity';
@Entity('User')
export class UserEntity extends AppBaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 320, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'date' })
  birthday: string | null;

  @Column({ type: 'varchar', length: 11 })
  numberPhone: string | null;

  @Column({ type: 'enum', enum: GenderEnum, default: GenderEnum.Other })
  gender: GenderEnum;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string | null;

  @Column({ type: 'boolean', default: 0 })
  isSocial: boolean;

  @Column({ type: 'boolean', default: 0 })
  isDeleted: boolean;

  @OneToOne(() => RoleEntity)
  @JoinColumn()
  role!: RoleEntity;

  @OneToMany(() => EventEntity, (event: EventEntity) => event.id)
  event!: EventEntity[];

  @OneToMany(() => OrderEntity, (order: OrderEntity) => order.id)
  order!: OrderEntity[];
}
