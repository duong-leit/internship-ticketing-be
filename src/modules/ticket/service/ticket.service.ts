import { InjectQueue } from '@nestjs/bull';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { PaymentService } from 'src/modules/payment/service/payment.service';
import { TicketEntity } from '../domain/entities/ticket.entity';
import { TicketStatusEnum } from '../domain/enums/ticketStatus.enum';
import {
  ICreateTicket,
  ITransferTicket,
} from '../domain/interfaces/ITicket.interface';
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
    // await this.createTicketsByEvent();
    return 'Hello World!';
  }

  async createTicketsByEvent(data: ICreateTicket): Promise<void> {
    // const data = {
    //   userId: 'ec6b5e5a-bddf-4c8f-88bc-661597070e8a',
    //   amount: 10,
    //   eventId: '598c46aa-eb10-49c5-9dfa-965cffe14801',
    // };
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
  ): Promise<TicketEntity[]> {
    const ticket = await this.ticketRepository.find({
      where: condition,
      take: takeNumber,
      skip: (page - 1) * takeNumber,
    });
    return ticket;
  }

  async updateTicket(ticket: string): Promise<boolean> {
    await this.ticketRepository.update(
      { nftToken: ticket },
      { status: TicketStatusEnum.Sold }
    );
    return true;
  }

  async transferTicketOwner(data: ITransferTicket): Promise<void> {
    const ticketList = await this.getTicketList(
      { eventId: data.eventId, status: TicketStatusEnum.Ready },
      data.amount
    );
    const tokenArray: string[] = ticketList.map((element) => element.nftToken);

    for (const nftToken of tokenArray) {
      await this.paymentService.createOrderDetail({
        nftToken,
        orderId: data.orderId,
      });
      await this.updateTicket(nftToken);
    }
  }
}
