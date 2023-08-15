import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, Post, UseGuards, Body, Param } from '@nestjs/common';
import { AuthService, OtpService } from '../services';
import { JwtAuthGuard, RefreshTokenGuard } from '../guards';
import { SendOtpReqDto, SigninReqDto, VerifyOtpReqDto } from '../dto/request';
import {
  LogoutResDto,
  OTPResDto,
  RefreshTokenResDto,
  SigninResDto,
  VerifyOTPResDto,
} from '../dto/response';
import { GetAccount } from '@/core/utils/decorators';

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
  @ApiBearerAuth('token')
  async logout(@GetAccount() account): Promise<LogoutResDto> {
    const response = await this.authService.handleLogout(account.accessToken);
    return response;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiBearerAuth('token')
  async refreshTokens(
    @GetAccount() account,
  ): Promise<string | RefreshTokenResDto> {
    const response = await this.authService.handleRefreshTokens(
      account.payload.accountId,
      account.refreshToken,
    );
    return response;
  }

  @ApiBody({ type: SendOtpReqDto })
  @Post('/send-otp')
  async sendOtp(@Body() phoneNumber: string): Promise<OTPResDto> {
    const response: OTPResDto = await this.otpService.sendOtp(phoneNumber);
    return response;
  }

  @ApiBody({ type: VerifyOtpReqDto })
  @Post('/:phonenumber/verify-otp')
  async verifyOtp(
    @Param('phonenumber') phonenumber: string,
    @Body() otp: string,
  ): Promise<VerifyOTPResDto> {
    const response = await this.otpService.verifyOtp(otp, phonenumber);
    return response;
  }
}
