import { Controller, Get, Param, Query } from '@nestjs/common';
import { TicketService } from '../service/ticket.service';
import { ApiTags } from '@nestjs/swagger';
import { TicketDto } from '../dto/ticket.dto';

@ApiTags('Ticket')
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  async getHello(): Promise<string> {
    return await this.ticketService.getHello();
  }

  @Get(':orderId')
  async transferOwner(@Param() orderI1d: string, @Query() queryData: string) {
    console.log(orderI1d, queryData);
    return orderI1d; //await this.ticketService.getTicket({});
  }
}
