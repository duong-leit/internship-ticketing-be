import { Module } from '@nestjs/common';
import { PaymentController } from './controller/payment.controller';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [],
})
export class PaymentModule {}
