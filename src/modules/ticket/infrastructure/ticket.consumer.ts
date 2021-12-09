import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { TicketRepository } from './ticket.repository';

@Processor('generate-ticket-token')
export class generateTicketConsumer {
  constructor(private ticketRepository: TicketRepository) {}
  @Process('generate')
  async generate(job: Job<{ eventId: string; sellerId: string; id: number }>) {
    try {
      // call tatum => token
      console.log('Lần: ', job.data.id);
      await this.ticketRepository.insert({
        eventId: job.data.eventId,
        nftToken: '123',
      });
    } catch (error) {
      console.log({ status: error?.statusCode, message: error?.message });
    }
  }
}
