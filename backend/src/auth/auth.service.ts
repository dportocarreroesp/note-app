import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.usersService.findOne(email);

    if (user.hashed_pwd !== password) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = { id: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      id: user.id,
    };
  }
}
