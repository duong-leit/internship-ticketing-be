import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { BankEntity } from 'src/modules/user/domain/entities/bank.entity';
import { OrderStatusEnum } from '../enums/orderStatus.enum';
import { AppBaseEntity } from 'src/common/entities/entity';
import { EventEntity } from 'src/modules/event/domain/entities/event.entity';
import { OrderDetailEntity } from './orderDetail.entity';
import { AutoMap } from '@automapper/classes';

@Entity('Order')
export class OrderEntity extends AppBaseEntity {
  @Column({
    type: 'enum',
    enum: OrderStatusEnum,
    default: OrderStatusEnum.Progress,
  })
  @AutoMap()
  status: OrderStatusEnum;

  @Column({ type: 'date', nullable: false })
  @AutoMap()
  orderDate: string;

  @Column({ type: 'int', nullable: false })
  @AutoMap()
  amount: number;

  @Column({ type: 'date' })
  @AutoMap()
  paymentDate: string | null;

  @Column({ type: 'uuid', name: 'buyerId' })
  buyerId: string;

  @Column({ type: 'uuid', name: 'eventId' })
  eventId: string;

  @Column({ type: 'uuid', name: 'bankId' })
  bankId: string;

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.id)
  @JoinColumn({ name: 'buyerId' })
  buyer: UserEntity;

  @ManyToOne(() => EventEntity, (event: EventEntity) => event.id)
  @JoinColumn({ name: 'eventId' })
  @AutoMap({ typeFn: () => EventEntity })
  event: EventEntity;

  @ManyToOne(() => BankEntity, (account: BankEntity) => account.id)
  @JoinColumn({ name: 'bankId' })
  @AutoMap({ typeFn: () => BankEntity })
  bank: BankEntity;

  @OneToMany(
    () => OrderDetailEntity,
    (orderDetail: OrderDetailEntity) => orderDetail.order
  )
  @AutoMap({ typeFn: () => OrderDetailEntity })
  orderDetail: OrderDetailEntity[];
}
