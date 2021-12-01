import { AppBaseEntity } from 'src/common/entities/entity';
import { OrderEntity } from 'src/modules/payment/domain/entities/order.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('Bank')
export class BankEntity extends AppBaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  cardHolderName!: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  creditNumber!: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.id)
  user!: UserEntity;

  @OneToMany(() => OrderEntity, (order: OrderEntity) => order.id)
  order!: OrderEntity[];
}
