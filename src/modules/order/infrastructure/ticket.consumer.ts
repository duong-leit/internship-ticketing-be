import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { OrderDetailRepository } from './repositories/orderDetail.repository';

@Processor('generate-ticket-token')
export class GenerateTicketConsumer {
  constructor(private orderDetailRepository: OrderDetailRepository) {}
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
