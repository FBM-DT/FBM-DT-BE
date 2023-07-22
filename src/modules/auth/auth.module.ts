import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AccountController, AuthController } from './controllers';
import { AccountService, AuthService } from './services';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AccountController, AuthController],
  providers: [AccountService, AuthService, JwtStrategy, RefreshTokenStrategy],
  exports: [AccountService, AuthService],
})
export class AuthModule {}
