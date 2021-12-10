import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get('/order')
  async getMyOrder() {
    const userId = 'af9541d5-dfef-4cfb-9e07-fe079adca878';
    const page = 0;
    return this.paymentService.getMyTicketOrder(userId, page);
  }

  @Get('order/:orderId')
  async getMyTicketByOrder(
    @Param('orderId') orderId: string,
    @Query() query: { page: number }
  ) {
    const userId = 'af9541d5-dfef-4cfb-9e07-fe079adca878';
    console.log(orderId);
    return await this.paymentService.getOrderDetails(
      userId,
      orderId,
      query.page
    );
  }

  @Post()
  checkoutTickets() {
    const userId = 'af9541d5-dfef-4cfb-9e07-fe079adca878';
    const data = {
      eventId: '598c46aa-eb10-49c5-9dfa-965cffe14801',
      amount: 3,
      bank: {
        creditCard: '123',
      },
    };
    return this.paymentService.handleTicketPayment({
      ...data,
      buyerId: userId,
    });
  }
}
