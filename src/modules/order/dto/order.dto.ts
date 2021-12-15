import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IOrder,
  IOrderDetail,
} from '../domain/interfaces/IOrderDetail.interface';

export interface OrderResponseDto {
  statusCode: number;
  data: IOrder;
}

export interface OrderDetailResponseDto {
  statusCode: number;
  data: IOrderDetail;
}

export class QueryPanigateDto {
  @ApiPropertyOptional()
  page: number;

  @ApiPropertyOptional()
  limit: number;
}
