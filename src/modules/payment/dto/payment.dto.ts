import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject, IsString, Min } from 'class-validator';
import { BankRequestDto } from 'src/modules/user/dto/bank.dto';
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
  @ApiProperty()
  eventId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @ApiProperty({ default: 1 })
  amount: number;

  @IsNotEmpty()
  @IsObject()
  @ApiProperty({
    default: {
      userId: 'af9541d5-dfef-4cfb-9e07-fe079adca878',
      name: 'myBank',
      cardHolderName: 'Lê Thị Mận Hồng Đào Dưa Ổi',
      creditNumber: '321379843',
    },
  })
  bank: BankRequestDto;

  //fake for test
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'fake userId from jwtToken' })
  userId: string;
}
