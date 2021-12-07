import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { GenderEnum } from '../domain/enums/gender.enum';

class FacebookDataDto {
  @Length(1)
  @ApiProperty()
  @IsString()
  username: string;

  @Length(1, 255)
  @ApiProperty()
  @IsString()
  email: string;

  @Length(1)
  @ApiProperty()
  @IsString()
  name: string;

  @Length(1)
  @ApiProperty()
  @IsOptional()
  birthday?: string;

  @ApiProperty()
  @IsString()
  avatarUrl?: string;
}

export class CreateSystemUserDto {
  @IsEmail()
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @Length(1)
  @IsString()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @Length(1)
  @ApiProperty()
  password: string;
}

export class CreateFacebookUserDto {
  @IsNotEmpty()
  @IsObject({ each: true })
  @ApiProperty()
  data: FacebookDataDto;

  @ApiProperty()
  accessToken: string;
}

export class CreateUserResponseDto {
  @IsNumber()
  statusCode: number;

  @IsString()
  message: string;
}

export class UserResponseDto {
  @ApiProperty()
  statusCode?: number;

  @ApiProperty()
  email?: string;

  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  birthday?: string;

  @ApiProperty()
  @IsOptional()
  gender?: GenderEnum;

  @ApiProperty()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty()
  @IsOptional()
  avatar?: string;
}
