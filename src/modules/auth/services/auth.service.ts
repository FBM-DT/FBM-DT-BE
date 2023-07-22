import { ForbiddenException, Injectable, Inject } from '@nestjs/common';
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

  async validateAccount(payload: SigninReqDto) {
    try {
      const { phonenumber, password } = payload;
      const account = await this.accountService.getAccountByPhoneNumber(
        phonenumber,
      );
      const passwordIsValid = await bcrypt.compare(password, account.password);

      if (!account || !passwordIsValid) {
        throw new Error(ErrorHandler.invalid('The phone number or password'));
      }
      return account;
    } catch (error) {
      throw new Error(error);
    }
  }

  async handleSignin(payload: SigninReqDto): Promise<SigninResDto> {
    const response: SigninResDto = new SigninResDto();
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
        account.id,
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
        throw new Error(ErrorHandler.invalid('Access token'));
      }

      return account;
    } catch (error) {
      throw new Error(error);
    }
  }

  async handleRefreshTokens(
    accountId: number,
    refreshToken: string,
  ): Promise<RefreshTokenResDto> {
    const response: RefreshTokenResDto = new RefreshTokenResDto();
    try {
      const account = await this._accountRepository.findOne({
        where: { id: accountId },
        relations: ['user', 'role'],
      });

      if (!account || !account.refreshToken)
        throw new ForbiddenException(ErrorMessage.ACCESS_DENIED);

      const refreshTokenIsValid = await bcrypt.compare(
        refreshToken,
        account.refreshToken,
      );
      if (!refreshTokenIsValid)
        throw new Error(ErrorHandler.invalid('Refresh token'));

      const authPayload: IAuthPayload = {
        accountId: account.id,
        fullname: account.user.fullname,
        phonenumber: account.phonenumber,
        role: account.role.name,
      };
      const tokens = await this.handleGenerateTokens(authPayload);
      await this.updateRefreshToken(account.id, tokens.refreshToken);
      AppResponse.setSuccessResponse<SigninResDto>(response, tokens);
      return response;
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
