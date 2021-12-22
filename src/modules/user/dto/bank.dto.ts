import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AutoMap } from '@automapper/classes';

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

export class CommonBankResponseDto {
  @AutoMap()
  id: string;

  @AutoMap()
  name: string;
}
