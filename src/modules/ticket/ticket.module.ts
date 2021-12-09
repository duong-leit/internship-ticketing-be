import { Module } from '@nestjs/common';
import { TicketController } from './controller/ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketRepository } from './infrastructure/ticket.repository';
import { TicketService } from './service/ticket.service';
import { BullModule } from '@nestjs/bull';
import { generateTicketConsumer } from './infrastructure/ticket.consumer';
import processor from './infrastructure/ticket.processor';
@Module({
  imports: [
    TypeOrmModule.forFeature([TicketRepository]),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: 'localhost',
          port: 6379,
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'generate-ticket-token',
      processors: [processor],
    }),
  ],
  controllers: [TicketController],
  providers: [TicketService, generateTicketConsumer],
  exports: [TypeOrmModule],
})
export class TicketModule {}
