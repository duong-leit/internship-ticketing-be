import { AutoMap } from '@automapper/classes';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EventDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @AutoMap()
  @ApiProperty()
  eventAddress: string;

  @IsNotEmpty()
  @ApiProperty()
  totalTickets: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  categoryId: string;

  //@IsNotEmpty()
  //@IsString()
  //@ApiProperty()
  userId?: string;

  @IsNotEmpty()
  @ApiProperty()
  ticketPrice: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  eventStartDate: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  eventEndDate: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  saleStartDate: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  saleEndDate: string;
  //availableTickets: number;
  @IsOptional()
  @ApiProperty()
  maxTicketOrder?: number;

  @IsOptional()
  @ApiProperty()
  minTicketOrder?: number;

  @IsOptional()
  @ApiProperty()
  logoUrl?: string;

  @IsOptional()
  @ApiProperty()
  bannerUrl?: string;

  @IsOptional()
  @ApiProperty()
  description?: string;

  @IsOptional()
  @ApiProperty()
  eventPlacename?: string;

  @IsOptional()
  @ApiProperty()
  ticketImageUrl?: string;

  @IsOptional()
  @ApiProperty()
  organizationInfo?: string;

  @IsOptional()
  @ApiProperty()
  organizationEmail?: string;

  @IsOptional()
  @ApiProperty()
  organizationPhone?: string;

  @IsOptional()
  @ApiProperty()
  organizationAddress?: string;
}

export class EventResponeDto {
  statusCode?: number;
  message?: string;
  data?: object;
}

export class PaginationDto {
  //   @ApiProperty()
  @ApiPropertyOptional()
  pageSize?: number;

  @ApiPropertyOptional()
  //   @ApiProperty()
  pageIndex?: number;
}

export class EventHeaderDto {
  @AutoMap()
  name: string;

  @AutoMap()
  eventStartDate: string;

  @AutoMap()
  eventEndDate: string;

  @AutoMap()
  logoUrl?: string;

  @AutoMap()
  eventAddress: string;

  @AutoMap()
  eventPlacename?: string;
}
