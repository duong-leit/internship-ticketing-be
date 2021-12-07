import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { UserRepository } from './infrastructure/user.repository';
import { UserService } from './service/user.service';
import { RoleModule } from '../role/role.module';
import { BankRepository } from './infrastructure/bank.repository';
import { WalletRepository } from './infrastructure/wallet.repository';
import { FacebookAuthModule } from 'facebook-auth-nestjs';
import { CLIENT_ID, CLIENT_SECRET } from 'src/common/constant';

@Module({
  imports: [
    FacebookAuthModule.forRoot({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    }),
    TypeOrmModule.forFeature([
      UserRepository,
      BankRepository,
      WalletRepository,
    ]),
    RoleModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule, UserService],
})
export class UserModule {}
