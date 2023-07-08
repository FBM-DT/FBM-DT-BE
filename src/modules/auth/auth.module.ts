import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AccountController, AuthController } from './controllers';
import { AccountService, AuthService } from './services';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRET_KEY'),
      }),
    }),
  ],
  controllers: [AccountController, AuthController],
  providers: [AccountService, AuthService, JwtStrategy, RefreshTokenStrategy],
  exports: [AccountService, AuthService],
})
export class AuthModule {}
