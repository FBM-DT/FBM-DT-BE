import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AccountController, AuthController } from './controllers';
import { AccountService, AuthService } from './services';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, RefreshTokenStrategy } from './strategies';
import { JWT_ACCESS_SECRET_KEY } from '../../core/constants';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({ secret: JWT_ACCESS_SECRET_KEY }),
  ],
  controllers: [AccountController, AuthController],
  providers: [AccountService, AuthService, JwtStrategy, RefreshTokenStrategy],
  exports: [AccountService, AuthService],
})
export class AuthModule {}
