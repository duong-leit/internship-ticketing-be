import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { EventCategoryEntity } from './eventCategory.entity';
import { EventStatusEnum } from '../enums/eventStatus.enum';
import { AppBaseEntity } from 'src/common/entities/entity';
import { OrderEntity } from 'src/modules/payment/domain/entities/order.entity';
@Entity('Event')
export class EventEntity extends AppBaseEntity {
  @Column({ type: 'text', nullable: false})
  name: string;

  @Column({ type: 'text', nullable: false })
  logoUrl: string;

  @Column({ type: 'text', nullable: false })
  bannerUrl: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  eventPlacename: string;

  @Column({ type: 'varchar', length: 255 })
  eventAddress: string;

  @Column({ type: 'date', nullable: false })
  saleStartDay: string;

  @Column({ type: 'date', nullable: false })
  saleEndDate: string;

  @Column({ type: 'date', nullable: false })
  eventStartDay: string;

  @Column({ type: 'date', nullable: false })
  eventEndDay: string;

  @Column({ type: 'int', default: 1, nullable: false })
  totalTickets: number;

  @Column({ type: 'int', default: 1, nullable: false })
  availableTickets: number;

  @Column({ type: 'text', nullable: false })
  ticketImageUrl: string;

  @Column({ type: 'decimal', nullable: false })
  ticketPrice: number;

  @Column({ type: 'int', nullable: false })
  maxTicketOrder: number;

  @Column({ type: 'int', nullable: false })
  minTicketOrder: number;

  @Column({ type: 'text', nullable: true })
  organizationInfo: string | null;

  @Column({ type: 'varchar', length: 321, nullable: true })
  organizationEmail: string | null;

  @Column({ type: 'varchar', length: 11, nullable: false })
  organizationPhone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: false })
  organizationAddress: string | null;

  @Column({ type: 'boolean', default: 0 })
  isDeleted: boolean;

  @Column({ type: 'enum', enum: EventStatusEnum, default: EventStatusEnum.Ready })
  status: EventStatusEnum;

  @ManyToOne(() => EventCategoryEntity, (category: EventCategoryEntity) => category.id)
  category: EventCategoryEntity;

  @ManyToOne(() => UserEntity, (publisher: UserEntity) => publisher.id)
  user: UserEntity;

  @OneToMany(() => OrderEntity, (order: OrderEntity) => order.id)
  order: OrderEntity[]
}
