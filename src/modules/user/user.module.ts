import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { UserRepository } from './infrastructure/user.repository';
import { UserService } from './service/user.service';
import { RoleModule } from '../role/role.module';
import { BankRepository } from './infrastructure/bank.repository';
import { WalletRepository } from './infrastructure/wallet.repository';
import { FacebookAuthModule } from 'facebook-auth-nestjs';
import {
  facebookAuthModuleOption,
  jwtModuleOption,
} from 'src/configs/configuration';
import { BankService } from './service/bank.service';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { ShareModule } from '../share/share.module';
import { WalletService } from './service/wallet.service';

@Module({
  imports: [
    FacebookAuthModule.forRootAsync(facebookAuthModuleOption),
    TypeOrmModule.forFeature([
      UserRepository,
      BankRepository,
      WalletRepository,
    ]),
    JwtModule.registerAsync(jwtModuleOption),
    RoleModule,
    forwardRef(() => AuthModule),
    ShareModule,
  ],
  controllers: [UserController],
  providers: [UserService, BankService, WalletService],
  exports: [TypeOrmModule, UserService, BankService, WalletService],
})
export class UserModule {}
