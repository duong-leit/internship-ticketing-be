import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { TicketEntity } from '../domain/entities/ticket.entity';
import { TicketStatusEnum } from '../domain/enums/ticketStatus.enum';
import { ICreateTicket } from '../infrastructure/ticket.interface';
import { TicketRepository } from '../infrastructure/ticket.repository';

@Injectable()
export class TicketService {
  constructor(
    @InjectQueue('generate-ticket-token') private generateTiket: Queue,
    private readonly ticketRepository: TicketRepository
  ) {}
  async getHello(): Promise<string> {
    await this.createTicketAsync();
    return 'Hello World!';
  }

  async createTicketAsync() {
    //data: ICreateTicket
    const data = {
      sellerId: 'ec6b5e5a-bddf-4c8f-88bc-661597070e8a',
      totalTicket: 3,
      eventId: '0174fbfc-8d47-4a96-924d-f364cc076b38',
    };

    for (let count = 1; count < data.totalTicket; count++) {
      await this.generateTiket.add(
        'generate',
        {
          eventId: data.eventId,
          sellerId: data.sellerId,
          id: count,
        }
        // { delay: 1000 * count }
      );
    }
    console.log('\n');
    return { statusCode: 200 };
  }

  async getTicket(
    condition: { [field: string]: string },
    takeNumber?: number,
    pageNumber?: number
  ) {
    // condition: {[field:string]: string}, take: number
    try {
      const ticket = await this.ticketRepository.find({
        where: condition,
        take: takeNumber,
        skip: pageNumber * takeNumber,
        // where: {
        //   eventId: '0174fbfc-8d47-4a96-924d-f364cc076b38',
        //   status: TicketStatusEnum.Ready,
        // },
        // take: 2,
      });
      const tokenArray: string[] = ticket.map((element) => element.nftToken);
      console.log(tokenArray);
      return tokenArray;
    } catch (error) {
      console.log(error.message);
      return { statusCode: error.statusCode, message: error.message };
    }
  }

  async deleteTicket(data: string[]) {
    try {
      await this.ticketRepository.delete(data);
      // data.forEach(async (id) => {
      //   await this.ticketRepository.update(id, {
      //     status: TicketStatusEnum.Sold,
      //   });
      // });
      return true;
    } catch (error) {
      return { statusCode: error.statusCode, message: error.message };
    }
  }
}
