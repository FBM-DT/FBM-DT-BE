import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from './account.service';
import { Account } from '../account.entity';
import { IAuthAccess, IAuthPayload } from '../interfaces';
import { AppResponse } from '../../../core/shared/app.response';
import { SignInRequestDto } from '../dto/request';
import { SignInResDto } from '../dto/response';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private accountService: AccountService,
    private readonly configService: ConfigService,
  ) {}

  async validateAccount(payload: SignInRequestDto) {
    try {
      const { phonenumber, password } = payload;
      const account = await this.accountService.getAccountByPhoneNumber(
        phonenumber,
      );
      const passwordIsValid = await bcrypt.compare(password, account.password);

      if (!account || !passwordIsValid) {
        throw new Error('The phone number or password is invalid');
      }
      return account;
    } catch (error) {
      throw new Error(error);
    }
  }

  async handleSignIn(payload: SignInRequestDto): Promise<SignInResDto> {
    const response: SignInResDto = new SignInResDto();
    try {
      const account = await this.validateAccount(payload);

      const authPayload: IAuthPayload = {
        accountId: account.id,
        fullname: account.user.fullname,
        phonenumber: account.phonenumber,
        role: account.role.name,
      };

      const tokens = await this.handleGenerateTokens(authPayload);
      await this.updateRefreshToken(account.id, tokens.refreshToken);
      AppResponse.setSuccessResponse<SignInResDto>(
        response,
        (response.data = tokens),
      );
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse<SignInResDto>(response, error.message);
      return response;
    }
  }

  async handleLogout(payload: IAuthAccess) {
    try {
      const token = payload.authorization.replace('Bearer', '').trim();
      const account = await this.verifyAccessToken(token);
      const response = await this.accountService.updateRefreshToken(
        account.id,
        {
          refreshToken: null,
        },
      );
      return response.refreshToken;
    } catch (error) {
      throw new Error(error);
    }
  }

  async verifyAccessToken(token: string): Promise<Account> {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET_KEY'),
      });

      const account = await this.accountService.getAccountByPhoneNumber(
        decodedToken.phonenumber,
      );

      if (!account) {
        throw new Error('Unable to get the account from decoded token.');
      }

      return account;
    } catch (error) {
      throw new Error(error);
    }
  }

  async handleRefreshTokens(accountId: number, refreshToken: string) {
    try {
      const account = await this.accountService.getAccountById(accountId);
      const result = Object.getOwnPropertyDescriptors(account.data);
      if (!account.data || !result.refreshToken.value)
        throw new ForbiddenException('Access Denied');

      const refreshTokenIsValid = await bcrypt.compare(
        refreshToken,
        result.refreshToken.value,
      );
      if (!refreshTokenIsValid)
        throw new ForbiddenException('Refresh token is not valid');

      const authPayload: IAuthPayload = {
        accountId: result.id.value,
        fullname: result.user.value.fullname,
        phonenumber: result.phonenumber.value,
        role: result.role.value.name,
      };
      const tokens = await this.handleGenerateTokens(authPayload);
      await this.updateRefreshToken(account.id, tokens.refreshToken);
      return tokens;
    } catch (error) {
      throw new Error(error);
    }
  }

  private async updateRefreshToken(accountId: number, refreshToken: string) {
    try {
      const saltOrRounds = 10;
      const hashedRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
      const result = await this.accountService.updateRefreshToken(accountId, {
        refreshToken: hashedRefreshToken,
      });
      return result.refreshToken;
    } catch (error) {
      throw new Error(error);
    }
  }

  private async handleGenerateTokens(payload: IAuthPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          payload,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET_KEY'),
          expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
        },
      ),
      this.jwtService.signAsync(
        {
          payload,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET_KEY'),
          expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
