import { TicketStatusEnum } from '../enums/ticketStatus.enum';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { EventEntity } from 'src/module/event/domain/entity/event.entity';
import { OrderEntity } from 'src/module/payment/domain/entity/order.entity';
import { AppBaseEntity } from 'src/common/entity/entity';
@Entity('Ticket')
export class TicketEntity extends AppBaseEntity {
  @ManyToOne(() => EventEntity, (event: EventEntity) => event.id, { nullable: false })
  event!: EventEntity;

  //OrderID
  @ManyToOne(() => OrderEntity, (order: OrderEntity) => order.id)
  order: OrderEntity;

  @Column({ type: 'enum', enum: TicketStatusEnum, default: TicketStatusEnum.Ready })
  status: TicketStatusEnum;

  @Column({ type: 'varchar', length: 510, nullable: false })
  nftToken!: string;
}
