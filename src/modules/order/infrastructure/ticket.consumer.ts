import { Processor, Process } from '@nestjs/bull';
import { forwardRef, Inject } from '@nestjs/common';
import { Job } from 'bull';
import { EventService } from 'src/modules/event/service/event.service';
import { OrderDetailRepository } from './repositories/orderDetail.repository';

@Processor('generate-ticket-token')
export class generateTicketConsumer {
  constructor(
    private orderDetailRepository: OrderDetailRepository,
    @Inject(forwardRef(() => EventService))
    private readonly eventService: EventService
  ) {}
  @Process('generate')
  async generate(job: Job<{ orderId: string; orderDetailId: string }>) {
    try {
      // call tatum => token
      // add token to wallet seller
      await this.orderDetailRepository.update(
        { orderId: job.data.orderId, id: job.data.orderDetailId },
        { nftToken: ((Math.random() * 1000000) ** 2).toString() }
      );
    } catch (error) {
      console.log('generate-ticket-token', error);
    }
  }
}
