import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class BankRequestDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty()
  cardHolderName: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty()
  creditNumber: string;
}
