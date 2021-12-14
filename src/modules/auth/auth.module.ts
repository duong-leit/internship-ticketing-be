import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { RoleModule } from '../role/role.module';
import { FacebookAuthModule } from 'facebook-auth-nestjs';
import {
  facebookAuthModuleOption,
  jwtModuleOption,
} from 'src/configs/configuration';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    FacebookAuthModule.forRootAsync(facebookAuthModuleOption),
    forwardRef(()=>UserModule),

    RoleModule,
    JwtModule.registerAsync(jwtModuleOption),
    RoleModule,
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
