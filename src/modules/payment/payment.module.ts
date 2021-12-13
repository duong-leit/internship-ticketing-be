import { forwardRef, Module } from '@nestjs/common';
import { PaymentController } from './controller/payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetailRepository } from './infrastructure/orderDetail.repository';
import { OrderRepository } from './infrastructure/order.repository';
import { PaymentService } from './service/payment.service';
import { TicketModule } from '../ticket/ticket.module';
import { EventModule } from '../event/event.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRepository, OrderDetailRepository]),
    EventModule,
    UserModule,
    forwardRef(() => TicketModule),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [TypeOrmModule, PaymentService],
})
export class PaymentModule {}
