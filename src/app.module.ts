import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import configuration, {
  googleRecatpChaModuleOption,
  typeormModuleOption,
} from './configs/configuration';

import { UserModule } from './modules/user/user.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { RoleModule } from './modules/role/role.module';
import { PaymentModule } from './modules/payment/payment.module';
import { EventModule } from './modules/event/event.module';
import { AuthModule } from './modules/auth/auth.module';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`environments/.env.${process.env.NODE_ENV}`],
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync(typeormModuleOption),
    GoogleRecaptchaModule.forRootAsync(googleRecatpChaModuleOption),
    UserModule,
    TicketModule,
    RoleModule,
    PaymentModule,
    EventModule,
    AuthModule,
  ],
})
export class AppModule {}
