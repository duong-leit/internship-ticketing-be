import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from '../role/infrastructure/role.repository';
import { UserController } from './controller/user.controller';
import { UserRepository } from './infrastructure/user.repository';
import { UserService } from './service/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, RoleRepository])],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
