import { EntityRepository, Repository } from 'typeorm';
import { EventCategoryEntity } from '../domain/entities/eventCategory.entity';

@EntityRepository(EventCategoryEntity)
export class EventCategoryRepository extends Repository<EventCategoryEntity> {}
