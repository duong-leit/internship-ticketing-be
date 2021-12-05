import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { JWT_SECRET_KEY, CLIENT_ID, CLIENT_SECRET } from 'src/common/constant';
import { RoleModule } from '../role/role.module';
import { FacebookAuthModule } from 'facebook-auth-nestjs';

@Module({
  controllers: [AuthController],
  imports: [
    FacebookAuthModule.forRoot({
      clientId: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
    }),
    UserModule,
    RoleModule,
    JwtModule.register({
      secret: JWT_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    RoleModule,
  ],
  providers: [AuthService],
})
export class AuthModule {}
