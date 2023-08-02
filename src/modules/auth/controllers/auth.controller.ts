import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Controller, Get, Req, Post, UseGuards, Body } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services';
import { JwtAuthGuard, RefreshTokenGuard } from '../guards';
import { SigninReqDto } from '../dto/request';
import {
  LogoutResDto,
  RefreshTokenResDto,
  SigninResDto,
} from '../dto/response';
import { OtpService } from '../services/otp.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly otpService: OtpService,
  ) {}

  @ApiOperation({ summary: 'Signin' })
  @ApiBody({ type: SigninReqDto })
  @Post('/signin')
  async signIn(@Body() payload: SigninReqDto): Promise<SigninResDto> {
    const response: SigninResDto = await this.authService.handleSignin(payload);
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  async logout(@Req() req: Request): Promise<LogoutResDto> {
    const response = await this.authService.handleLogout(req.headers);
    return response;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(
    @Req() req: Request,
  ): Promise<string | RefreshTokenResDto> {
    const account = req.user['payload'];
    const refreshToken = req.user['refreshToken'];
    const response = await this.authService.handleRefreshTokens(
      account.accountId,
      refreshToken,
    );
    return response;
  }
  @Post('/send-otp')
  async sendOtp(@Body() phoneNumber: string): Promise<{ message: string }> {
    await this.otpService.sendOtp(phoneNumber);
    return { message: 'OTP sent successfully!' };
  }
}
