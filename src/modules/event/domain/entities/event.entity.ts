import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from 'src/modules/user/domain/entities/user.entity';
import { EventStatusEnum } from '../enums/eventStatus.enum';
import { AppBaseEntity } from 'src/common/entities/entity';
import { OrderEntity } from 'src/modules/order/domain/entities/order.entity';
import { EventCategoryEntity } from './eventCategory.entity';
import { AutoMap } from '@automapper/classes';
@Entity('Event')
export class EventEntity extends AppBaseEntity {
  @Column({ type: 'text', nullable: false })
  @AutoMap()
  name: string;

  @Column({ type: 'text', nullable: true })
  @AutoMap()
  logoUrl?: string;

  @Column({ type: 'text', nullable: true })
  @AutoMap()
  bannerUrl?: string;

  @Column({ type: 'text', nullable: true })
  @AutoMap()
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @AutoMap()
  eventPlacename: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @AutoMap()
  eventAddress: string;

  @Column({ type: 'date', nullable: false })
  @AutoMap()
  saleStartDate: string;

  @Column({ type: 'date', nullable: true })
  @AutoMap()
  saleEndDate: string;

  @Column({ type: 'date', nullable: false })
  @AutoMap()
  eventStartDate: string;

  @Column({ type: 'date', nullable: false })
  @AutoMap()
  eventEndDate: string;

  @Column({ type: 'int', default: 1, nullable: true })
  @AutoMap()
  totalTickets: number;

  @Column({ type: 'int', default: 0, nullable: true })
  @AutoMap()
  availableTickets: number;

  @Column({ type: 'text', nullable: true })
  @AutoMap()
  ticketImageUrl?: string;

  @Column({ type: 'decimal', nullable: true })
  @AutoMap()
  ticketPrice: number;

  @Column({ type: 'int', default: 1, nullable: false })
  @AutoMap()
  maxTicketOrder: number;

  @Column({ type: 'int', default: 1, nullable: false })
  @AutoMap()
  minTicketOrder: number;

  @Column({ type: 'text', nullable: true })
  @AutoMap()
  organizationInfo: string | null;

  @Column({ type: 'varchar', length: 321, nullable: true })
  @AutoMap()
  organizationEmail: string | null;

  @Column({ type: 'varchar', length: 11, nullable: true })
  @AutoMap()
  organizationPhone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @AutoMap()
  organizationAddress: string | null;

  @Column({ type: 'boolean', default: 0 })
  isDeleted: boolean;

  @Column({
    type: 'enum',
    enum: EventStatusEnum,
    default: EventStatusEnum.Pending,
  })
  @AutoMap()
  status: EventStatusEnum;

  @Column({ type: 'uuid', name: 'categoryId' })
  categoryId: string;

  @Column({ type: 'uuid', name: 'userId' })
  userId: string;

  @ManyToOne(
    () => EventCategoryEntity,
    (category: EventCategoryEntity) => category.id
  )
  @JoinColumn({ name: 'categoryId' })
  category!: EventCategoryEntity;

  @ManyToOne(() => UserEntity, (publisher: UserEntity) => publisher.id)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => OrderEntity, (order: OrderEntity) => order.id)
  order: OrderEntity[];
}
