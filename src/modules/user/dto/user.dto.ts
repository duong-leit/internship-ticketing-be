import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { GenderEnum } from '../domain/enums/gender.enum';

// class FacebookDataDto {
//   @Length(1)
//   @ApiProperty()
//   @IsString()
//   username: string;
//
//   @Length(1, 255)
//   @ApiProperty()
//   @IsString()
//   email: string;
//
//   @Length(1)
//   @ApiProperty()
//   @IsString()
//   name: string;
//
//   @Length(1)
//   @ApiProperty()
//   @IsOptional()
//   birthday?: string;
//
//   @ApiProperty()
//   @IsString()
//   avatarUrl?: string;
// }

export class filterDto {
  @ApiProperty()
  key: string | number;
}

export class paginationDto {
  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  pageIndex: number;
}

export class GetListUserDto {
  @ApiProperty({ type: filterDto })
  filter: filterDto;

  @ApiProperty({ type: paginationDto })
  pagination: paginationDto;
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

export class UpdateUserDto {
  @IsString()
  @Length(1, 255)
  @ApiProperty()
  @IsOptional()
  name?: string;

  @IsString()
  @Length(1, 255)
  @ApiProperty()
  @IsOptional()
  password?: string;

  @IsString()
  @Length(1, 255)
  @IsOptional()

  // @ApiProperty()
  birthday?: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  @ApiProperty()
  @IsOptional()
  gender?: GenderEnum;

  @IsString()
  @Length(1, 255)
  @ApiProperty()
  @IsOptional()
  phoneNumber?: string;

  @IsString()
  @Length(1)
  @ApiProperty()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty()
  @IsOptional()
  avatarFile?: any;

  @IsString()
  @Length(1, 255)
  @ApiProperty()
  @IsOptional()
  role?: string;

  @ApiProperty()
  isDeleted?: boolean;
}

export class CreateFacebookUserDto {
  @ApiProperty()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;
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

  // @ApiProperty()
  // @IsOptional()
  // phoneNumber?: string;
  //
  // @ApiProperty()
  // @IsOptional()
  // avatar?: string;
}
