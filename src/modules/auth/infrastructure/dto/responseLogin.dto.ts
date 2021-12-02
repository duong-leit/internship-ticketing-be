import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class responseLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;
}
