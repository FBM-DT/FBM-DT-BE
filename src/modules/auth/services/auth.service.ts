import { Injectable, Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TYPEORM } from '../../../core/constants';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from './account.service';
import { Account } from '../account.entity';
import { IAuthAccess, IAuthPayload } from '../interfaces';
import { AppResponse } from '../../../core/shared/app.response';
import { SigninReqDto } from '../dto/request';
import {
  LogoutResDto,
  RefreshTokenResDto,
  SigninResDto,
} from '../dto/response';
import { ErrorMessage } from '../constrants/errorMessages';
import { ErrorHandler } from '../../../core/shared/common/error';

@Injectable()
export class AuthService {
  private _accountRepository: Repository<Account>;
  constructor(
    @Inject(TYPEORM) dataSource: DataSource,
    private jwtService: JwtService,
    private accountService: AccountService,
    private readonly configService: ConfigService,
  ) {
    this._accountRepository = dataSource.getRepository(Account);
  }

  async validateAccount(payload: SigninReqDto): Promise<Account | string> {
    try {
      const { phonenumber, password } = payload;
      const account = await this.accountService.getAccountByPhoneNumber(
        phonenumber,
      );
      const passwordIsValid = await bcrypt.compare(
        password,
        account['password'],
      );

      if (!account || !passwordIsValid) {
        return ErrorHandler.invalid('The phone number or password');
      }
      return account;
    } catch (error) {
      return error.message;
    }
  }

  private createAuthPayload(account: Account): IAuthPayload {
    return {
      accountId: account['id'],
      fullname: account['user']['fullname'],
      phonenumber: account['phonenumber'],
      role: account['role']['name'],
    };
  }

  async handleSignin(payload: SigninReqDto): Promise<SigninResDto> {
    const response: SigninResDto = new SigninResDto();
    try {
      const account = await this.validateAccount(payload);

      if (typeof account === 'string') {
        AppResponse.setUserErrorResponse<SigninResDto>(response, account, {
          status: 403,
        });
        return response;
      }

      const authPayload: IAuthPayload = this.createAuthPayload(account);

      const tokens = await this.handleGenerateTokens(authPayload);
      await this.updateRefreshToken(account['id'], tokens.refreshToken);
      AppResponse.setSuccessResponse<SigninResDto>(response, tokens);
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse<SigninResDto>(response, error.message);
      return response;
    }
  }

  async handleLogout(payload: IAuthAccess): Promise<LogoutResDto> {
    const response: LogoutResDto = new LogoutResDto();
    try {
      const token = payload.authorization.replace('Bearer', '').trim();
      const account = await this.verifyAccessToken(token);
      const updateRefreshToken = await this.accountService.updateRefreshToken(
        account['id'],
        {
          refreshToken: null,
        },
      );
      const result = {
        refreshToken: updateRefreshToken.refreshToken,
      };
      AppResponse.setSuccessResponse<LogoutResDto>(response, result);
      return response;
    } catch (error) {
      return error.message;
    }
  }

  async verifyAccessToken(token: string): Promise<Account | string> {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET_KEY'),
      });

      const account = await this.accountService.getAccountByPhoneNumber(
        decodedToken.phonenumber,
      );

      if (!account) {
        return ErrorHandler.invalid('Access token');
      }

      return account;
    } catch (error) {
      return error.message;
    }
  }

  async handleRefreshTokens(
    accountId: number,
    refreshToken: string,
  ): Promise<RefreshTokenResDto | string> {
    const response: RefreshTokenResDto = new RefreshTokenResDto();
    try {
      const account = await this._accountRepository.findOne({
        where: { id: accountId },
        relations: ['user', 'role'],
      });

      if (!account || !account.refreshToken) return ErrorMessage.ACCESS_DENIED;

      const refreshTokenIsValid = await bcrypt.compare(
        refreshToken,
        account.refreshToken,
      );
      if (!refreshTokenIsValid) return ErrorHandler.invalid('Refresh token');

      const authPayload: IAuthPayload = this.createAuthPayload(account);
      const tokens = await this.handleGenerateTokens(authPayload);
      await this.updateRefreshToken(account.id, tokens.refreshToken);
      AppResponse.setSuccessResponse<SigninResDto>(response, tokens);
      return response;
    } catch (error) {
      return error.message;
    }
  }

  private async updateRefreshToken(
    accountId: number,
    refreshToken: string,
  ): Promise<string> {
    try {
      const saltOrRounds = 10;
      const hashedRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
      const result = await this.accountService.updateRefreshToken(accountId, {
        refreshToken: hashedRefreshToken,
      });
      return result.refreshToken;
    } catch (error) {
      return error.message;
    }
  }

  private async handleGenerateTokens(
    payload: IAuthPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
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
