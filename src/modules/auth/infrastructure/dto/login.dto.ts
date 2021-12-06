import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class FacebookLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  avatarUrl: string;
}

export class userInfo{
  name?: string;
  avatar?: string
}

export class responseLoginDto {
  @ApiProperty()
  @IsNumber()
  statusCode: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  accessToken?: string;

  @ApiProperty()
  @IsOptional()
  data?: userInfo

  @ApiProperty()
  @IsString()
  @IsOptional()
  message?: string;
}
