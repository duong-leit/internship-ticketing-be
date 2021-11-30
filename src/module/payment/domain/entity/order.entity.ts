import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/module/user/domain/entity/user.entity';
import { BankEntity } from 'src/module/user/domain/entity/bank.entity';
import { OrderStatusEnum } from '../enums/orderStatus.enum';
import { AppBaseEntity } from 'src/common/entity/entity';
import { TicketEntity } from 'src/module/ticket/domain/entity/ticket.entity';

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

  @ManyToOne(() => BankEntity, (account: BankEntity) => account.id)
  bank: BankEntity;

  @OneToMany(() => TicketEntity, (ticket: TicketEntity) => ticket.id)
  ticket!: TicketEntity[];
}
