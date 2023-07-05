import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Req,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services';
import { SignInRequestDto } from '../dto';
import { HttpExceptionFilter } from '../../../core/shared/exception.filter';
import { JwtAuthGuard, RefreshTokenGuard } from '../guards';

@UseFilters(new HttpExceptionFilter())
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'SignIn by account' })
  @ApiBody({ type: SignInRequestDto })
  @Post('/signin')
  async signIn(@Req() req: Request) {
    return await this.authService.handleSignIn(req.body);
  }

  @ApiBearerAuth('token')
  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  async logout(@Req() req: Request) {
    return await this.authService.handleLogout(req.headers);
  }

  @ApiBearerAuth('token')
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
