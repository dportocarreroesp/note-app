import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3d' },
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      // ALL ROUTES REQUIRE AUTH,
      // EXCEPT THOSE WITH @SkipAuth decorator
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
