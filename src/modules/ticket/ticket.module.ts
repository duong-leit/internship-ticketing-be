import { forwardRef, Module } from '@nestjs/common';
import { TicketController } from './controller/ticket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketRepository } from './infrastructure/ticket.repository';
import { TicketService } from './service/ticket.service';
import { BullModule } from '@nestjs/bull';
import { generateTicketConsumer } from './infrastructure/ticket.consumer';
import processor from './infrastructure/ticket.processor';
import { PaymentModule } from '../payment/payment.module';
import { EventModule } from '../event/event.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketRepository]),
    forwardRef(() => PaymentModule),
    forwardRef(() => EventModule),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: 'localhost',
          port: 6379,
        },
        limiter: {
          max: 5,
          duration: 1000,
          bounceBack: false,
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
  exports: [TypeOrmModule, TicketService],
})
export class TicketModule {}
