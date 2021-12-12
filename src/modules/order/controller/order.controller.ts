import { Controller, Get } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //get all order
  @Get()
  async getOrders(): Promise<string> {
    return await this.orderService.getHello();
  }
  //get detail order
  @Get(':id')
  async getOrderDetails(): Promise<string> {
    return await this.orderService.getHello();
  }
}
