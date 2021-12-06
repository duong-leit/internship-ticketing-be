import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty, IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { GenderEnum } from '../domain/enums/gender.enum';

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
  @Length(1)
  @IsString()
  username: string

  @Length(1, 255)
  @IsString()
  email: string;

  @Length(1)
  @IsString()
  name: string;

  @Length(1)
  @ApiProperty()
  @IsOptional()
  birthday?: string;
}

export class CreateUserResponseDto{
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
