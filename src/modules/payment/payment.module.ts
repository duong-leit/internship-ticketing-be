import { Module } from '@nestjs/common';
import { PaymentController } from './controller/payment.controller';
import { PaymentService } from './service/payment.service';
import { OrderModule } from '../order/order.module';
import { EventModule } from '../event/event.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [EventModule, UserModule, OrderModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
