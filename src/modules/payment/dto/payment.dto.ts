import { IsNotEmpty, IsNumber, IsObject, IsString, Min } from 'class-validator';
import { OrderStatusEnum } from '../domain/enums/orderStatus.enum';

export class OrderResponseDto {
  status?: OrderStatusEnum;
  id?: string;
  orderDate?: string;
  amount?: number;
  paymentDate?: string;
  buyerId?: string;
  event?: string;
}
export class OrderRequestDto {
  @IsNotEmpty()
  @IsString()
  eventId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  amount: number;

  @IsNotEmpty()
  @IsObject()
  bank: any;
}
