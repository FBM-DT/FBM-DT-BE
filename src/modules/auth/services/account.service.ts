import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TYPEORM } from '../../../core/constants';
import { DataSource, Repository } from 'typeorm';
import { AppResponse } from '../../../core/shared/app.response';
import { Account } from '../account.entity';
import {
  CreateAccountResDto,
  GetAccountResDto,
  GetAllAccountsResDto,
  UpdateAccountResDto,
  ChangePasswordResDto,
} from '../dto/response';
import {
  ChangePasswordReqDto,
  CreateAccountReqDto,
  UpdateAccountReqDto,
} from '../dto/request';
import { ErrorHandler } from '../../../core/shared/common/error';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class AccountService {
  private _accountRepository: Repository<Account>;
  private _dataSource: DataSource;
  constructor(
    @Inject(TYPEORM) dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {
    this._dataSource = dataSource;
    this._accountRepository = dataSource.getRepository(Account);
  }

  async getAccountList(): Promise<GetAllAccountsResDto> {
    const response: GetAllAccountsResDto = new GetAllAccountsResDto();
    try {
      const account = await this._accountRepository.find({
        relations: {
          role: true,
          user: true,
        },
        order: {
          id: 'ASC',
        },
      });

      AppResponse.setSuccessResponse<GetAllAccountsResDto>(response, account);
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse<GetAllAccountsResDto>(
        response,
        error.message,
      );
      return response;
    }
  }

  async getAccountById(id: number): Promise<GetAccountResDto> {
    const response: GetAccountResDto = new GetAccountResDto();
    try {
      const account = await this._accountRepository.findOne({
        where: { id },
        relations: ['user', 'role'],
      });
      if (!account) {
        AppResponse.setUserErrorResponse<GetAccountResDto>(
          response,
          ErrorHandler.notFound(`Account ${id}`),
        );
        return response;
      }

      AppResponse.setSuccessResponse<GetAccountResDto>(response, account);
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse<GetAccountResDto>(
        response,
        error.message,
      );
      return response;
    }
  }

  async getAccountByPhoneNumber(
    phoneNumber: string,
  ): Promise<Account | string> {
    try {
      const response = await this._accountRepository.findOne({
        where: { phonenumber: phoneNumber },
        relations: ['user', 'role'],
      });
      return response;
    } catch (error) {
      return error.message;
    }
  }

  async createAccount(
    payload: CreateAccountReqDto,
  ): Promise<CreateAccountResDto> {
    const response: CreateAccountResDto = new CreateAccountResDto();
    try {
      const { phonenumber, password } = payload;

      const existPhoneNumber = await this._accountRepository.findOne({
        where: { phonenumber },
      });

      if (phonenumber === existPhoneNumber?.phonenumber) {
        AppResponse.setUserErrorResponse<UpdateAccountResDto>(
          response,
          ErrorHandler.alreadyExists('The phone number'),
        );
        return response;
      } else {
        const hashPassword = this.handleHashPassword(password);
        const data = { ...payload, password: hashPassword };

        const account = await this._accountRepository
          .createQueryBuilder()
          .insert()
          .into(Account)
          .values(data)
          .execute();

        AppResponse.setSuccessResponse<CreateAccountResDto>(
          response,
          account.identifiers[0].id,
          {
            status: 201,
            message: 'Created',
          },
        );
        return response;
      }
    } catch (error) {
      AppResponse.setAppErrorResponse<CreateAccountResDto>(
        response,
        error.message,
      );
      return response;
    }
  }

  async updateAccount(
    accountId: number,
    accountDto: UpdateAccountReqDto,
  ): Promise<UpdateAccountResDto> {
    const response: UpdateAccountResDto = new UpdateAccountResDto();
    try {
      let newPassword: string;
      const { phonenumber, password } = accountDto;
      const existPhoneNumber = await this._accountRepository.findOne({
        where: { phonenumber },
      });

      if (phonenumber === existPhoneNumber?.phonenumber) {
        AppResponse.setUserErrorResponse<UpdateAccountResDto>(
          response,
          ErrorHandler.alreadyExists('The phone number'),
        );
        return response;
      }

      if (!password) {
        const result = await this._accountRepository
          .createQueryBuilder('account')
          .update(Account)
          .where('account.id = :accountId', { accountId: accountId })
          .set(accountDto)
          .execute();
        AppResponse.setSuccessResponse<UpdateAccountResDto>(
          response,
          result.affected,
        );
        return response;
      } else {
        newPassword = this.handleHashPassword(password);
        const account = { ...accountDto, password: newPassword };
        const result = await this._accountRepository
          .createQueryBuilder('account')
          .update(Account)
          .where('account.id = :accountId', { accountId: accountId })
          .set(account)
          .execute();
        AppResponse.setSuccessResponse<UpdateAccountResDto>(
          response,
          result.affected,
        );
        return response;
      }
    } catch (error) {
      AppResponse.setAppErrorResponse<UpdateAccountResDto>(
        response,
        error.message,
      );
      return response;
    }
  }

  async changePassword(
    accountId: number,
    payload: ChangePasswordReqDto,
  ): Promise<ChangePasswordResDto> {
    const response: ChangePasswordResDto = new ChangePasswordResDto();
    const { currentPassword, newPassword, confirmPassword } = payload;
    try {
      const account = await this._accountRepository.findOne({
        where: { id: accountId },
      });

      if (!account) {
        AppResponse.setUserErrorResponse<ChangePasswordResDto>(
          response,
          ErrorHandler.notFound(`Account ${accountId}`),
          {
            status: 404,
          },
        );
        return response;
      }

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        account?.password,
      );

      if (!isValidPassword) {
        AppResponse.setUserErrorResponse<ChangePasswordResDto>(
          response,
          ErrorHandler.invalid('The current password'),
        );
        return response;
      }

      if (confirmPassword !== newPassword) {
        AppResponse.setUserErrorResponse<ChangePasswordResDto>(
          response,
          ErrorHandler.invalid('The confirm password'),
        );
        return response;
      }

      const isValidFormatPassword = await this.isPasswordValid(newPassword);
      if (isValidFormatPassword === false) {
        AppResponse.setUserErrorResponse<ChangePasswordResDto>(
          response,
          'The password and confirm password are not correct format',
        );
        return response;
      }

      const hashPassword = await this.handleHashPassword(newPassword);
      const password = hashPassword;
      const result = await this._accountRepository.update(accountId, {
        password: password,
      });

      AppResponse.setSuccessResponse<ChangePasswordResDto>(
        response,
        result.affected,
      );
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse<ChangePasswordResDto>(
        response,
        error.message,
      );
      return response;
    }
  }

  async updateRefreshToken(
    id: number,
    payload: UpdateAccountReqDto,
  ): Promise<Account> {
    try {
      const account = await this._accountRepository.findOneBy({ id });
      account.refreshToken = payload.refreshToken;
      return await this._accountRepository.save(account);
    } catch (error) {
      return error.message;
    }
  }

  private async isPasswordValid(password: string): Promise<boolean> {
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const numberRegex = /[0-9]/;
    const specialRegex = /[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/;

    const hasUppercase = uppercaseRegex.test(password);
    const hasLowercase = lowercaseRegex.test(password);
    const hasNumber = numberRegex.test(password);
    const hasSpecialChar = specialRegex.test(password);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      return false;
    } else if (hasUppercase && hasLowercase && hasNumber && hasSpecialChar) {
      return true;
    }
  }

  private handleHashPassword(password: string) {
    const saltOrRounds = 10;
    const hashPassword = bcrypt.hashSync(password, saltOrRounds);
    return hashPassword;
  }
}
