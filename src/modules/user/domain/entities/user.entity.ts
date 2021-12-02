import { GenderEnum } from '../enums/gender.enum';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { RoleEntity } from 'src/modules/role/domain/entities/role.entity';
import { AppBaseEntity } from 'src/common/entities/entity';
import { EventEntity } from 'src/modules/event/domain/entities/event.entity';
import { OrderEntity } from 'src/modules/payment/domain/entities/order.entity';
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

  @Column({ type: 'date', nullable: true })
  birthday: string | null;

  @Column({ type: 'varchar', length: 11, nullable: true })
  numberPhone: string | null;

  @Column({ type: 'enum', enum: GenderEnum, default: GenderEnum.Other })
  gender: GenderEnum;

  @Column({ type: 'text', nullable: true })
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
