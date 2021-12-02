import { Module } from '@nestjs/common';
import { PaymentController } from './controller/payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderDetailRepository } from './infrastructure/orderDetail.repository';
import { OrderRepository } from './infrastructure/order.repository';
import { PaymentService } from './service/payment.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    OrderRepository,
    OrderDetailRepository,
  ])],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [TypeOrmModule]
})
export class PaymentModule {}
