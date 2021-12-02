import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class responseLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token: string;
}
