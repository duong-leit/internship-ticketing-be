import { Controller, Get } from '@nestjs/common';
import { TicketService } from '../service/ticket.service';

@Controller('ticket')
export class TicketController {
  constructor(private readonly appService: TicketService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
