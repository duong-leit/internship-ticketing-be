import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { OrderStatusEnum } from '../../order/domain/enums/orderStatus.enum';

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
  @ApiProperty()
  eventId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ default: 1 })
  amount: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    default: 'af9541d5-dfef-4cfb-9e07-fe079adca878',
  })
  bankId: string;
}
