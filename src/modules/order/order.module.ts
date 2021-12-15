import { Module } from '@nestjs/common';
import { OrderController } from './controller/order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './service/order.service';
import { BullModule } from '@nestjs/bull';
import { GenerateTicketConsumer } from './infrastructure/ticket.consumer';
import processor from './infrastructure/ticket.processor';
import { EventModule } from '../event/event.module';
import { OrderRepository } from './infrastructure/repositories/order.repository';
import { OrderDetailRepository } from './infrastructure/repositories/orderDetail.repository';
import {
  REDIS_QUEUE_LIMIT_BOUNCEBACK,
  REDIS_QUEUE_LIMIT_DURATION,
  REDIS_QUEUE_LIMIT_MAX,
} from 'src/common/constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRepository, OrderDetailRepository]),
    EventModule,
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        },
        limiter: {
          max: REDIS_QUEUE_LIMIT_MAX,
          duration: REDIS_QUEUE_LIMIT_DURATION,
          bounceBack: REDIS_QUEUE_LIMIT_BOUNCEBACK,
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'generate-ticket-token',
      processors: [processor],
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, GenerateTicketConsumer],
  exports: [TypeOrmModule, OrderService],
})
export class OrderModule {}
