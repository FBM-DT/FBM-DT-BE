import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { Controller, Get, Req, Post, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services';
import { JwtAuthGuard, RefreshTokenGuard } from '../guards';
import { SigninReqDto } from '../dto/request';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'SignIn by account' })
  @ApiBody({ type: SigninReqDto })
  @Post('/signin')
  async signIn(@Req() req: Request) {
    return await this.authService.handleSignin(req.body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  async logout(@Req() req: Request) {
    return await this.authService.handleLogout(req.headers);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const account = req.user['payload'];
    console.log(account);
    const refreshToken = req.user['refreshToken'];
    return this.authService.handleRefreshTokens(
      account.accountId,
      refreshToken,
    );
  }
}
