import { Controller, Get } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // @Get()
  // getHello(): string {
  //   return this.paymentService.getHello();
  // }

  @Get()
  checkoutTickets() {
    return this.paymentService.handleTicketPayment();
  }
}
