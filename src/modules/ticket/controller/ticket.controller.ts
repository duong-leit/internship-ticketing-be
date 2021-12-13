import { Controller, Get } from '@nestjs/common';
import { TicketService } from '../service/ticket.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Ticket')
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Get()
  async getHello(): Promise<string> {
    return await this.ticketService.getHello();
  }
}
