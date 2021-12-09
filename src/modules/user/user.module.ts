import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { UserRepository } from './infrastructure/user.repository';
import { UserService } from './service/user.service';
import { RoleModule } from '../role/role.module';
import { BankRepository } from './infrastructure/bank.repository';
import { WalletRepository } from './infrastructure/wallet.repository';
import { FacebookAuthModule } from 'facebook-auth-nestjs';
import { facebookAuthModuleOption } from 'src/configs/configuration';
import { BankService } from './service/bank.service';

@Module({
  imports: [
    FacebookAuthModule.forRootAsync(facebookAuthModuleOption),
    TypeOrmModule.forFeature([
      UserRepository,
      BankRepository,
      WalletRepository,
    ]),
    RoleModule,
  ],
  controllers: [UserController],
  providers: [UserService, BankService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
