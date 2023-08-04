import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Req,
  Post,
  UseGuards,
  Body,
  Param,
} from '@nestjs/common';
import { Request } from 'express';
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
  async logout(@Req() req: Request): Promise<LogoutResDto> {
    const response = await this.authService.handleLogout(req.headers);
    return response;
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  @ApiBearerAuth('token')
  async refreshTokens(
    @Req() req: Request,
  ): Promise<string | RefreshTokenResDto> {
    const account = req.user['payload'];
    console.log(account);
    const refreshToken = req.user['refreshToken'];
    const response = await this.authService.handleRefreshTokens(
      account.accountId,
      refreshToken,
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
  @Post('/:phonenumber/verification-otp')
  async verificationOtp(
    @Param('phonenumber') phonenumber: string,
    @Body() otp: string,
  ): Promise<VerifyOTPResDto> {
    const response = await this.otpService.verifyOtp(otp, phonenumber);
    return response;
  }

  // @ApiBody({ type: VerifyOtpReqDto })
  // @Post('/:phonenumber/verification-otp-code')
  // async verificationOtpCode(
  //   @Param('phonenumber') phonenumber: string,
  //   @Body() otp: string,
  // ): Promise<VerifyOTPResDto> {
  //   const response = await this.otpService.OtpVerification(phonenumber, otp);
  //   return response;
  // }
}
