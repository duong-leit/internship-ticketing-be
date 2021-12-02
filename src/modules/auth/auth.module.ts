import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { jwtSecretKey } from 'src/common/constant';

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    JwtModule.register({
      secret: jwtSecretKey,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService],
})
export class AuthModule {}
