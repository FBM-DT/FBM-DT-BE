import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AccountController, AuthController } from './controllers';
import { AccountService, AuthService } from './services';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy, RefreshTokenStrategy } from './strategies';
import { TwilioModule } from 'nestjs-twilio';
import { OtpService } from './services/otp.service';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PassportModule,
    JwtModule.register({}),
    TwilioModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        accountSid: configService.get<string>('TWILIO_ACCOUNT_SID'),
        authToken: configService.get<string>('TWILIO_AUTH_TOKEN'),
        serviceSid: configService.get('TWILIO_VERIFICATION_SERVICE_SID'),
      }),
    }),
  ],
  controllers: [AccountController, AuthController],
  providers: [
    AccountService,
    AuthService,
    OtpService,
    JwtStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AccountService, AuthService, JwtStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
