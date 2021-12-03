import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class RoleRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

export class PermissionRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

export class RolePermissionRequestDto {
  @ApiProperty()
  roleId: string

  @ApiProperty()
  permissionId: string
}
