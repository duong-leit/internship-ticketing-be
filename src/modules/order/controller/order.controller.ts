import { Controller, Get, Param, Query } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //get all order
  @Get()
  async getOrders() {
    const userId = 'af9541d5-dfef-4cfb-9e07-fe079adca878';
    const page = 0;
    const take = 5;
    return this.orderService.getOrders({ buyerId: userId }, ['event'], {
      take,
      pageIndex: page,
    });
  }

  //get detail order
  @Get(':orderId')
  @ApiParam({ name: 'orderId', required: true })
  async getOrderDetails(
    @Param('orderId') orderId: string,
    @Query() query = { take: 5, page: 0 }
  ) {
    const userId = 'af9541d5-dfef-4cfb-9e07-fe079adca878';
    // const take = 5;
    return await this.orderService.getOrderDetails(
      userId,
      orderId,
      query.take,
      query.page
    );
  }
}
