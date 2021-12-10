import { Processor, Process } from '@nestjs/bull';
import { forwardRef, Inject } from '@nestjs/common';
import { Job } from 'bull';
import { EventService } from 'src/modules/event/service/event.service';
import { TicketRepository } from './ticket.repository';

@Processor('generate-ticket-token')
export class generateTicketConsumer {
  constructor(
    private ticketRepository: TicketRepository,
    @Inject(forwardRef(() => EventService))
    private readonly eventService: EventService
  ) {}
  @Process('generate')
  async generate(job: Job<{ eventId: string; sellerId: string; id: number }>) {
    try {
      // call tatum => token
      // add token to wallet seller
      await this.ticketRepository.insert({
        eventId: job.data.eventId,
        nftToken: job.data.id.toString(),
      });
      this.eventService.updateAvailableTickets(job.data.eventId, 1);
    } catch (error) {
      console.log('ticket consumer', {
        status: error?.statusCode,
        message: error?.message,
      });
    }
  }
}
