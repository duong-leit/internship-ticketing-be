import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventRepository } from '../infrastructure/event.repository';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventRepository)
    private readonly eventRepository: EventRepository
  ) {}
  getHello(): string {
    return 'Hello World!';
  }
  async getEventByID(eventId: string) {
    return await this.eventRepository.findOne({
      where: { id: eventId },
    });
  }
}
