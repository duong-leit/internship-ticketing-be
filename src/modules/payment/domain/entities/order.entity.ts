import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { BankEntity } from 'src/modules/user/domain/entities/bank.entity';
import { OrderStatusEnum } from '../enums/orderStatus.enum';
import { AppBaseEntity } from 'src/common/entities/entity';
import { EventEntity } from 'src/modules/event/domain/entities/event.entity';
import { OrderDetailEntity } from './orderDetail.entity';


@Entity('Order')
export class OrderEntity extends AppBaseEntity {
  @Column({ type: 'enum', enum: OrderStatusEnum, default: OrderStatusEnum.Progress })
  status: OrderStatusEnum;

  @Column({ type: 'date', nullable: false })
  orderDate: string;

  @Column({ type: 'int', nullable: false })
  amount: number;

  @Column({ type: 'date' })
  paymentDate: string | null;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.id)
  buyer: UserEntity;

  @ManyToOne(() => EventEntity, (event: EventEntity) => event.id)
  event: EventEntity;

  @ManyToOne(
    () => BankEntity,
    (account: BankEntity) => account.id)
  bank: BankEntity;

  @OneToMany(() => OrderDetailEntity, (orderDetail: OrderDetailEntity) => orderDetail.id)
  orderDetail: OrderDetailEntity[];
}
