import { AppBaseEntity } from 'src/common/entities/entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { OrderEntity } from '../../../payment/domain/entities/order.entity';


@Entity('Bank')
export class BankEntity extends AppBaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  cardHolderName!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  creditNumber!: string;

  @OneToOne(() => UserEntity)
  @JoinColumn()
  user!: UserEntity;

  @OneToMany(
    () => OrderEntity,
    (order: OrderEntity) => order.id)
  order!: OrderEntity[];
}
