import { ApiPropertyOptional } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';
import { IOrder } from '../domain/interfaces/IOrderDetail.interface';
import { EventHeaderDto } from 'src/modules/event/dto/event.dto';
import { CommonBankResponseDto } from 'src/modules/user/dto/bank.dto';
import { OrderDetailDto } from './orderDetail.dto';

export interface OrderResponseDto {
  statusCode: number;
  data: IOrder;
}

export class QueryPanigateDto {
  @ApiPropertyOptional()
  page: number;

  @ApiPropertyOptional()
  limit: number;
}

export class OrderDto {
  @AutoMap()
  id: string;

  @AutoMap()
  createdAt: string;

  @AutoMap()
  status: string;

  @AutoMap()
  orderDate: string;

  @AutoMap()
  amount: number;

  @AutoMap()
  paymentDate: string;

  @AutoMap({ typeFn: () => EventHeaderDto })
  event: EventHeaderDto;

  @AutoMap({ typeFn: () => CommonBankResponseDto })
  bank: CommonBankResponseDto;

  @AutoMap({ typeFn: () => OrderDetailDto })
  orderDetail: OrderDetailDto[];
}
