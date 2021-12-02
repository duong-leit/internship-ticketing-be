import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from 'src/modules/user/infrastructure/user.repository';
import { UserService } from 'src/modules/user/service/user.service';
import { UserLoginDto } from '../infrastructure/dto/systemLogin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { responseLoginDto } from '../infrastructure/dto/responseLogin.dto';
import { RoleRepository } from 'src/modules/role/infrastructure/role.repository';

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository, private jwtService: JwtService, private roleRepository: RoleRepository) {}
  async systemLogin(data: UserLoginDto): Promise<responseLoginDto> {
    const result = await this.userRepository.findOne({
      relations: ['role'],
      where: {
        username: data.username,
      },
    });
    if (!result) throw new UnauthorizedException('username is invalid');
    if (bcrypt.compareSync(data.password, result.password)) {
      const payload = {
        sub: result.id,
        name: result.name,
        avatar: result.avatar,
        role: result.role.name,
      };
      return {
        token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('password is invalid');
  }
}
