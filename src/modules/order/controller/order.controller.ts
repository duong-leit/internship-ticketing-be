import { Controller, Get, Query, Res } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/modules/role/domain/enums/role.enum';
import { Response } from 'express';
import { transferResponse } from 'src/common/utils/transferResponse';
import { IOrder } from '../domain/interfaces/IOrderDetail.interface';
import { QueryPanigateDto, OrderResponseDto } from '../dto/order.dto';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';
import { User } from 'src/modules/auth/decorators/user.decorator';

@ApiTags('order')
@ApiBearerAuth()
@Roles(RoleEnum.User)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //get all order
  @Get()
  @ApiQuery({ type: QueryPanigateDto })
  async getOrders(
    @Res() res: Response,
    @Query() { page = 1, limit = 5 }: QueryPanigateDto,
    @User('userId') userId: string
  ) {
    console.log('reqdasdasdas', userId);
    const data: IOrder = await this.orderService.getOrders(
      { userId },
      ['event', 'orderDetail', 'bank'],
      page,
      limit
    );
    const responseData: OrderResponseDto = { statusCode: 200, data: data };

    transferResponse(res, responseData);
  }
}
