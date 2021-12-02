import { EntityRepository, Repository } from 'typeorm';
import { TicketEntity } from '../domain/entities/ticket.entity';

@EntityRepository(TicketEntity)
export class TicketRepository extends Repository<TicketEntity> {}
