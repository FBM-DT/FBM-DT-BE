import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TYPEORM } from '../../../core/constants';
import { DataSource, Repository } from 'typeorm';
import { AppResponse } from '../../../core/shared/app.response';
import { Account } from '../account.entity';
import {
  ChangePasswordResDto,
  CreateAccountResDto,
  GetAccountResDto,
  GetAllAccountsResDto,
  UpdateAccountResDto,
} from '../dto/response';
import {
  ChangePasswordReqDto,
  CreateAccountReqDto,
  UpdateAccountReqDto,
} from '../dto/request';
import { ErrorHandler } from '../../../core/shared/common/error';

@Injectable()
export class AccountService {
  private _accountRepository: Repository<Account>;
  private _dataSource: DataSource;
  constructor(@Inject(TYPEORM) dataSource: DataSource) {
    this._dataSource = dataSource;
    this._accountRepository = dataSource.getRepository(Account);
  }

  async getAccountList(): Promise<GetAllAccountsResDto> {
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

      const response: GetAllAccountsResDto =
        AppResponse.setSuccessResponse<GetAllAccountsResDto>(account);
      return response;
    } catch (error) {
      const response: GetAllAccountsResDto =
        AppResponse.setAppErrorResponse<GetAllAccountsResDto>(error.message);
      return response;
    }
  }

  async getAccountById(id: number): Promise<GetAccountResDto> {
    try {
      const account = await this._accountRepository.findOne({
        where: { id },
        relations: ['user', 'role'],
      });
      if (!account) {
        const response: GetAccountResDto =
          AppResponse.setUserErrorResponse<GetAccountResDto>(
            ErrorHandler.notFound(`Account ${id}`),
          );
        return response;
      }

      const response: GetAccountResDto =
        AppResponse.setSuccessResponse<GetAccountResDto>(account);
      return response;
    } catch (error) {
      const response: GetAccountResDto =
        AppResponse.setAppErrorResponse<GetAccountResDto>(error.message);
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
    try {
      const { phonenumber, password } = payload;

      const existPhoneNumber = await this._accountRepository.findOne({
        where: { phonenumber },
      });

      if (phonenumber === existPhoneNumber?.phonenumber) {
        const response: CreateAccountResDto =
          AppResponse.setUserErrorResponse<UpdateAccountResDto>(
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

        const response: CreateAccountResDto =
          AppResponse.setSuccessResponse<CreateAccountResDto>(
            account.identifiers[0].id,
            {
              status: 201,
              message: 'Created',
            },
          );
        return response;
      }
    } catch (error) {
      const response: CreateAccountResDto =
        AppResponse.setAppErrorResponse<CreateAccountResDto>(error.message);
      return response;
    }
  }

  async updateAccount(
    accountId: number,
    accountDto: UpdateAccountReqDto,
  ): Promise<UpdateAccountResDto> {
    try {
      let newPassword: string;
      const { phonenumber, password } = accountDto;
      const existPhoneNumber = await this._accountRepository.findOne({
        where: { phonenumber },
      });

      if (phonenumber === existPhoneNumber?.phonenumber) {
        const response: UpdateAccountResDto =
          AppResponse.setUserErrorResponse<UpdateAccountResDto>(
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
        const response: UpdateAccountResDto =
          AppResponse.setSuccessResponse<UpdateAccountResDto>(result.affected);
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
        const response: UpdateAccountResDto =
          AppResponse.setSuccessResponse<UpdateAccountResDto>(result.affected);
        return response;
      }
    } catch (error) {
      const response: UpdateAccountResDto =
        AppResponse.setAppErrorResponse<UpdateAccountResDto>(error.message);
      return response;
    }
  }

  async changePassword(
    accountId: number,
    payload: ChangePasswordReqDto,
  ): Promise<ChangePasswordResDto> {
    const { currentPassword, newPassword, confirmPassword } = payload;
    try {
      const account = await this._accountRepository.findOne({
        where: { id: accountId },
      });

      if (!account) {
        const response: ChangePasswordResDto =
          AppResponse.setUserErrorResponse<ChangePasswordResDto>(
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
        const response: ChangePasswordResDto =
          AppResponse.setUserErrorResponse<ChangePasswordResDto>(
            ErrorHandler.invalid('The current password'),
          );
        return response;
      }

      if (confirmPassword !== newPassword) {
        const response: ChangePasswordResDto =
          AppResponse.setUserErrorResponse<ChangePasswordResDto>(
            ErrorHandler.invalid('The confirm password'),
          );
        return response;
      }

      const isValidFormatPassword = await this.isPasswordValid(newPassword);
      if (isValidFormatPassword === false) {
        const response: ChangePasswordResDto =
          AppResponse.setUserErrorResponse<ChangePasswordResDto>(
            'The password and confirm password are not correct format',
          );
        return response;
      }

      const hashPassword = await this.handleHashPassword(newPassword);
      const password = hashPassword;
      const result = await this._accountRepository.update(accountId, {
        password: password,
      });

      const response: ChangePasswordResDto =
        AppResponse.setSuccessResponse<ChangePasswordResDto>(result.affected);
      return response;
    } catch (error) {
      const response: ChangePasswordResDto =
        AppResponse.setAppErrorResponse<ChangePasswordResDto>(error.message);
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
