import { Module } from '@nestjs/common';
import { TicketController } from './controller/ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketRepository } from './infrastructure/ticket.repository';
import { TicketService } from './service/ticket.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    TicketRepository
  ])],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TypeOrmModule]
})
export class TicketModule {}
