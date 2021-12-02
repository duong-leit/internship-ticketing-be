import { TicketStatusEnum } from '../enums/ticketStatus.enum';
import { Column, Entity, ManyToOne } from 'typeorm';
import { EventEntity } from 'src/modules/event/domain/entities/event.entity';
import { AppBaseEntity } from 'src/common/entities/entity';


@Entity('Ticket')
export class TicketEntity extends AppBaseEntity {
  @ManyToOne(() => EventEntity, (event: EventEntity) => event.id, { nullable: false })
  event!: EventEntity;

  @Column({ type: 'enum', enum: TicketStatusEnum, default: TicketStatusEnum.Ready })
  status: TicketStatusEnum;

  @Column({ type: 'varchar', length: 510, nullable: false })
  nftToken!: string;
}
