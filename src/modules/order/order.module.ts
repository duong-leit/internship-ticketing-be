import { Module } from '@nestjs/common';
import { OrderController } from './controller/order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './service/order.service';
import { BullModule } from '@nestjs/bull';
import { generateTicketConsumer } from './infrastructure/ticket.consumer';
import processor from './infrastructure/ticket.processor';
// import { PaymentModule } from '../payment/payment.module';
import { EventModule } from '../event/event.module';
import { OrderRepository } from './infrastructure/repositories/order.repository';
import { OrderDetailRepository } from './infrastructure/repositories/orderDetail.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRepository, OrderDetailRepository]),
    // forwardRef(() => PaymentModule),
    EventModule, //forwardRef(() => ),
    BullModule.forRootAsync({
      useFactory: () => ({
        redis: {
          host: 'localhost',
          port: 6379,
        },
        limiter: {
          max: 5,
          duration: 5000,
          bounceBack: false,
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'generate-ticket-token',
      processors: [processor],
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService, generateTicketConsumer],
  exports: [TypeOrmModule, OrderService],
})
export class OrderModule {}
