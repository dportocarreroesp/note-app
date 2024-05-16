import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dtos/sign_in.dto';
import { SkipAuth } from './skip-auth';
import { Response } from 'express';
import { addDays } from 'date-fns';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('sign_in')
  async signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const payload = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );

    response.cookie('token', payload.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      expires: addDays(new Date(), 3),
    });

    return payload;
  }
}
