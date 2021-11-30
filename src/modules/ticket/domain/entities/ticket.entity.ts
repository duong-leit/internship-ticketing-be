import { TicketStatusEnum } from '../enums/ticketStatus.enum';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { EventEntity } from 'src/modules/event/domain/entities/event.entity';
import { OrderEntity } from 'src/modules/payment/domain/entities/order.entity';
import { AppBaseEntity } from 'src/common/entities/entity';
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
