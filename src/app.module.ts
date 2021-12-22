import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration, {
  googleRecaptchaModuleOption,
  typeormModuleOption,
} from './configs/configuration';
import { UserModule } from './modules/user/user.module';
import { OrderModule } from './modules/order/order.module';
import { RoleModule } from './modules/role/role.module';
import { PaymentModule } from './modules/payment/payment.module';
import { EventModule } from './modules/event/event.module';
import { AuthModule } from './modules/auth/auth.module';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './modules/auth/guards/role.guard';
import { JwtAuthGuard } from './modules/auth/guards/auth.guard';
import { ShareModule } from './modules/share/share.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`environments/.env.${process.env.NODE_ENV}`],
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync(typeormModuleOption),
    GoogleRecaptchaModule.forRootAsync(googleRecaptchaModuleOption),
    UserModule,
    OrderModule,
    RoleModule,
    PaymentModule,
    EventModule,
    AuthModule,
    ShareModule,
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
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
