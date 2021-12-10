import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { EventStatusEnum } from '../enums/eventStatus.enum';
import { AppBaseEntity } from 'src/common/entities/entity';
import { OrderEntity } from 'src/modules/payment/domain/entities/order.entity';
import { EventCategoryEntity } from './eventCategory.entity';
@Entity('Event')
export class EventEntity extends AppBaseEntity {
  @Column({ type: 'text', nullable: false})
  name: string;

  @Column({ type: 'text', nullable: true })
  logoUrl?: string;

  @Column({ type: 'text', nullable: true })
  bannerUrl?: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  eventPlacename: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  eventAddress: string;

  @Column({ type: 'date', nullable: false })
  saleStartDate: string;

  @Column({ type: 'date', nullable: false })
  saleEndDate: string;

  @Column({ type: 'date', nullable: false })
  eventStartDate: string;

  @Column({ type: 'date', nullable: false })
  eventEndDate: string;

  @Column({ type: 'int', default: 1, nullable: false })
  totalTickets: number;

  @Column({ type: 'int', default: 1, nullable: false })
  availableTickets: number;

  @Column({ type: 'text', nullable: true })
  ticketImageUrl?: string;

  @Column({ type: 'decimal', nullable: false })
  ticketPrice: number;

  @Column({ type: 'int', default: 1, nullable: false })
  maxTicketOrder: number;

  @Column({ type: 'int', default: 1, nullable: false })
  minTicketOrder: number;

  @Column({ type: 'text', nullable: true })
  organizationInfo: string | null;

  @Column({ type: 'varchar', length: 321, nullable: true })
  organizationEmail: string | null;

  @Column({ type: 'varchar', length: 11, nullable: true })
  organizationPhone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  organizationAddress: string | null;

  @Column({ type: 'boolean', default: 0 })
  isDeleted: boolean;

  @Column({ type: 'enum', enum: EventStatusEnum, default: EventStatusEnum.Pending })
  status: EventStatusEnum;

  @Column({type: 'uuid', name: 'categoryId'})
  categoryId: string;

  @Column({type: 'uuid', name: 'userId'})
  userId: string;

  @ManyToOne(
    () => EventCategoryEntity,
    (category: EventCategoryEntity) => category.id)
  @JoinColumn({name: 'categoryId'})
  category!: EventCategoryEntity;

  @ManyToOne(
    () => UserEntity,
    (publisher: UserEntity) => publisher.id)
  @JoinColumn({name: 'userId'})
  user: UserEntity;

  @OneToMany(() => OrderEntity, (order: OrderEntity) => order.id)
  order: OrderEntity[]
}
