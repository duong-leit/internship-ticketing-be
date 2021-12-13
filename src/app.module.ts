import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration, {
  googleRecaptchaModuleOption,
  typeormModuleOption,
} from './configs/configuration';
import { UserModule } from './modules/user/user.module';
import { TicketModule } from './modules/ticket/ticket.module';
import { RoleModule } from './modules/role/role.module';
import { PaymentModule } from './modules/payment/payment.module';
import { EventModule } from './modules/event/event.module';
import { AuthModule } from './modules/auth/auth.module';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './modules/auth/guards/role.guard';
import { JwtAuthGuard } from './modules/auth/guards/auth.guard';
// import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`environments/.env.${process.env.NODE_ENV}`],
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync(typeormModuleOption),
    GoogleRecaptchaModule.forRootAsync(googleRecaptchaModuleOption),
    UserModule,
    TicketModule,
    RoleModule,
    PaymentModule,
    EventModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class AppModule {}
