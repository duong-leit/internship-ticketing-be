import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { RoleEnum } from 'src/modules/role/domain/enums/role.enum';
import { Response } from 'express';
import { transferResponse } from 'src/common/utils/transferResponse';
import {
  IOrder,
  IOrderDetail,
} from '../domain/interfaces/IOrderDetail.interface';
import {
  QueryPanigateDto,
  OrderDetailResponseDto,
  OrderResponseDto,
} from '../dto/order.dto';
import { Roles } from 'src/modules/auth/roles.decorator';

@ApiTags('order')
@Roles(RoleEnum.User)
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  //get all order
  @Get()
  @ApiQuery({ type: QueryPanigateDto })
  async getOrders(
    @Req() req,
    @Res() res: Response,
    @Query() { page = 1, limit = 5 }: QueryPanigateDto
  ) {
    const data: IOrder = await this.orderService.getOrders(
      undefined,
      ['event', 'orderDetail', 'bank'],
      page,
      limit
    );
    const responseData: OrderResponseDto = { statusCode: 200, data: data };

    transferResponse(res, responseData);
  }

  //get detail order
  @Get(':orderId')
  @ApiParam({ name: 'orderId', required: true })
  @ApiQuery({ type: QueryPanigateDto })
  async getOrderDetails(
    @Req() req,
    @Res() res: Response,
    @Param('orderId') orderId: string,
    @Query() { page = 1, limit = 5 }: QueryPanigateDto
  ) {
    try {
      const data: IOrderDetail = await this.orderService.getOrderDetails(
        req.user.userId,
        orderId,
        page,
        limit
      );
      const responseData: OrderDetailResponseDto = {
        statusCode: 200,
        data: data,
      };
      transferResponse(res, responseData);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
