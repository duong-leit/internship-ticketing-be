import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { OrderRequestDto } from '../dto/payment.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  // @Get('/order')
  // async getMyOrder() {
  //   const userId = 'af9541d5-dfef-4cfb-9e07-fe079adca878';
  //   const page = 0;
  //   return this.paymentService.getMyTicketOrder(userId, page);
  // }

  // @Get('order/:orderId')
  // @ApiParam({ name: 'orderId', required: true })
  // async getMyTicketByOrder(
  //   @Param('orderId') orderId: string,
  //   @Query() query: { page: number }
  // ) {
  //   const userId = 'af9541d5-dfef-4cfb-9e07-fe079adca878';
  //   return await this.paymentService.getOrderDetails(
  //     userId,
  //     orderId,
  //     query.page
  //   );
  // }

  @Post()
  @ApiBody({ type: OrderRequestDto })
  checkoutTickets(@Body() data: OrderRequestDto) {
    /* const userId = 'af9541d5-dfef-4cfb-9e07-fe079adca878';
    const data = {
      eventId: '598c46aa-eb10-49c5-9dfa-965cffe14801',
      amount: 3,
      bank: {
        creditNumber: '123',
        name: 'TPBank',
        cardHolderName: 'Ha Anh Khoa',
      },
    };
    */
    return this.paymentService.handleCheckout({
      ...data,
      // req.user.userId
    });
  }
}
