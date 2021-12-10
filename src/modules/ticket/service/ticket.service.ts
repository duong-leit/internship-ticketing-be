import { InjectQueue } from '@nestjs/bull';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { PaymentService } from 'src/modules/payment/service/payment.service';
import { TicketStatusEnum } from '../domain/enums/ticketStatus.enum';
// import { ICreateTicket } from '../domain/interfaces/ITicket.interface';
import { TicketRepository } from '../infrastructure/ticket.repository';

@Injectable()
export class TicketService {
  constructor(
    @InjectQueue('generate-ticket-token') private generateTiket: Queue,
    private readonly ticketRepository: TicketRepository,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService
  ) {}
  async getHello(): Promise<string> {
    await this.createTicketsByEvent();
    return 'Hello World!';
  }

  async createTicketsByEvent(): Promise<void> {
    //data: ICreateTicket
    const data = {
      userId: 'ec6b5e5a-bddf-4c8f-88bc-661597070e8a',
      amount: 10,
      eventId: '598c46aa-eb10-49c5-9dfa-965cffe14801',
    };
    for (let count = 0; count < data.amount; count++) {
      await this.generateTiket.add('generate', {
        eventId: data.eventId,
        sellerId: data.userId,
        id: (Math.random() * 1000000).toString(), // fake token
      });
    }
  }

  async getTicketList(
    condition: { [field: string]: string },
    takeNumber?: number,
    page?: number
  ) {
    const ticket = await this.ticketRepository.find({
      where: condition,
      take: takeNumber,
      skip: (page - 1) * takeNumber,
    });
    const tokenArray: string[] = ticket.map((element) => element.nftToken);
    return tokenArray;
  }

  async updateTicket(ticket: string) {
    await this.ticketRepository.update(
      { nftToken: ticket },
      { status: TicketStatusEnum.Sold }
    );
    return true;
  }

  async transferTicketOwner(orderId: string, eventId: string, amount: number) {
    const ticketList = await this.getTicketList(
      { eventId: eventId, status: TicketStatusEnum.Ready },
      amount
    );
    for (const nftToken of ticketList) {
      await this.paymentService.createOrderDetail({ nftToken, orderId });
      await this.updateTicket(nftToken);
    }
  }
}
