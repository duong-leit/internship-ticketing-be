import { Controller, Get } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly appService: PaymentService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
