import { Module } from '@nestjs/common';
import { TicketController } from './controller/ticket.controller';

@Module({
  imports: [],
  controllers: [TicketController],
  providers: [],
})
export class AppModule {}
