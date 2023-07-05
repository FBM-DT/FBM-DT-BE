import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from './account.service';
import {
  SignInRequestDto,
  SignInResponseDto,
  ValidateAccountResponseDto,
} from '../dto';
import { Account } from '../account.entity';
import {
  ACCESS_EXPIRES_TIME,
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
  REFRESH_EXPIRES_TIME,
} from '../../../core/constants';
import { IAuthAccess, IAuthPayload } from '../interfaces';
import { AppResponse } from '../../../core/shared/app.response';
import { CustomHttpException } from '../../../core/shared/custom.http.exception';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private accountService: AccountService,
  ) {}

  async validate(
    payload: SignInRequestDto,
  ): Promise<ValidateAccountResponseDto> {
    const response: ValidateAccountResponseDto =
      new ValidateAccountResponseDto();
    try {
      const { phonenumber, password } = payload;
      const account = await this.accountService.getAccountByPhoneNumber(
        phonenumber,
      );
      const passwordIsValid = await bcrypt.compare(password, account.password);

      if (!account || !passwordIsValid) {
        AppResponse.setUserErrorResponse<ValidateAccountResponseDto>(
          response,
          'The phone number or password is invalid',
          (response.data = {
            message: 'The phone number or password is invalid',
            status: 400,
          }),
        );
        return response;
      }

      AppResponse.setSuccessResponse<ValidateAccountResponseDto>(
        response,
        (response.data = account),
      );
      return response;
    } catch (error) {
      if (error.status !== 500) {
        console.log(error.message);
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async handleSignIn(payload: SignInRequestDto): Promise<SignInResponseDto> {
    try {
      const validationAccount = await this.validate(payload);
      const account = Object.getOwnPropertyDescriptors(validationAccount?.data);
      if (account?.status?.value === 400) {
        throw new CustomHttpException(
          account.message.value,
          HttpStatus.BAD_REQUEST,
        );
      }

      const authPayload: IAuthPayload = {
        accountId: account.id.value,
        fullname: account.user.value.fullname,
        phonenumber: account.phonenumber.value,
        role: account.role.value.name,
      };

      const tokens = await this.handleGenerateTokens(authPayload);
      await this.updateRefreshToken(account.id.value, tokens.refreshToken);
      return tokens;
    } catch (error) {
      if (error.status !== 500) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async handleLogout(payload: IAuthAccess) {
    try {
      const token = payload.authorization.replace('Bearer', '').trim();
      const account = await this.verifyAccessToken(token);
      const response = await this.accountService.updateRefreshTokenAccount(
        account.id,
        {
          refreshToken: null,
        },
      );
      return response.refreshToken;
    } catch (error) {
      if (error.status !== 500) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async verifyAccessToken(token: string): Promise<Account> {
    try {
      const decodedToken = this.jwtService.verify(token, {
        secret: JWT_ACCESS_SECRET_KEY,
      });

      const account = await this.accountService.getAccountByPhoneNumber(
        decodedToken.phonenumber,
      );

      if (!account) {
        throw new Error('Unable to get the account from decoded token.');
      }

      return account;
    } catch (error) {
      if (error.status !== 500) {
        console.log(error.message);
        throw error.message;
      }
      throw new InternalServerErrorException();
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
      console.log(error.message);
    }
  }

  async updateRefreshToken(accountId: number, refreshToken: string) {
    try {
      const saltOrRounds = 10;
      const hashedRefreshToken = await bcrypt.hash(refreshToken, saltOrRounds);
      const result = await this.accountService.updateRefreshTokenAccount(
        accountId,
        {
          refreshToken: hashedRefreshToken,
        },
      );
      return result.refreshToken;
    } catch (error) {
      console.log(error.message);
    }
  }

  async handleGenerateTokens(payload: IAuthPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          payload,
        },
        {
          secret: JWT_ACCESS_SECRET_KEY,
          expiresIn: ACCESS_EXPIRES_TIME,
        },
      ),
      this.jwtService.signAsync(
        {
          payload,
        },
        {
          secret: JWT_REFRESH_SECRET_KEY,
          expiresIn: REFRESH_EXPIRES_TIME,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
