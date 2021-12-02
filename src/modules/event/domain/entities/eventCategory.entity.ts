import { AppBaseEntity } from 'src/common/entities/entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { EventEntity } from './event.entity';


@Entity('EventCategory')
export class EventCategoryEntity extends AppBaseEntity {
  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @OneToMany(
    () => EventEntity,
    (event: EventEntity) => event.id)
  event!: EventEntity[];
}
