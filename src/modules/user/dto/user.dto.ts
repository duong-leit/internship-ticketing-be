import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';


export class CreateUserDto {
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

export class UserResponseDto {
  @ApiProperty()
  email?: string;

  @ApiProperty()
  @IsOptional()
  name?: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsOptional()
  username?: string;

  @ApiProperty()
  birthday?: string;
}
