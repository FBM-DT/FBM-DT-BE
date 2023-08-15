import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TYPEORM } from '@/core/constants';
import { DataSource, Repository } from 'typeorm';
import { AppResponse } from '@/core/shared/app.response';
import { Account } from '../account.entity';
import {
  ChangePasswordResDto,
  CreateAccountResDto,
  GetAccountResDto,
  GetAllAccountsResDto,
  NewPasswordResDto,
  UpdateAccountResDto,
} from '../dto/response';
import {
  ChangePasswordReqDto,
  CreateAccountReqDto,
  NewPasswordReqDto,
  UpdateAccountReqDto,
} from '../dto/request';
import { ErrorHandler } from '@/core/shared/common/error';
import { Bcrypt } from '@/core/utils';

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
        const hashPassword = Bcrypt.handleHashPassword(password);
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

        if (result.affected === 0)
          return AppResponse.setUserErrorResponse<UpdateAccountResDto>(
            ErrorHandler.notFound(`Account ${accountId}`),
          );
        const response: UpdateAccountResDto =
          AppResponse.setSuccessResponse<UpdateAccountResDto>(result.affected);
        return response;
      } else {
        newPassword = Bcrypt.handleHashPassword(password);
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

      const isValidFormatPassword = await Bcrypt.isPasswordValid(newPassword);
      if (isValidFormatPassword === false) {
        const response: ChangePasswordResDto =
          AppResponse.setUserErrorResponse<ChangePasswordResDto>(
            'The password and confirm password are not correct format',
          );
        return response;
      }

      const hashPassword = Bcrypt.handleHashPassword(newPassword);
      const result = await this._accountRepository.update(accountId, {
        password: hashPassword,
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
  async handleNewPassword(
    phonenumber: string,
    payload: NewPasswordReqDto,
  ): Promise<NewPasswordResDto> {
    const { newPassword, confirmPassword } = payload;
    try {
      const account = await this._accountRepository.findOne({
        where: { phonenumber: phonenumber },
      });

      if (!account) {
        const response: NewPasswordResDto =
          AppResponse.setUserErrorResponse<NewPasswordResDto>(
            ErrorHandler.notFound(`The phone number ${phonenumber}`),
          );
        return response;
      }

      if (!account.isValidOtp) {
        const response: NewPasswordResDto =
          AppResponse.setUserErrorResponse<NewPasswordResDto>(
            ErrorHandler.invalid('The OTP'),
            {
              data: {
                status: 'rejected',
                message: 'You need to verify OTP first',
              },
            },
          );
        return response;
      }

      if (confirmPassword !== newPassword) {
        const response: NewPasswordResDto =
          AppResponse.setUserErrorResponse<NewPasswordResDto>(
            ErrorHandler.invalid('The confirm password'),
          );
        return response;
      }

      const isValidFormatPassword = await Bcrypt.isPasswordValid(newPassword);
      if (!isValidFormatPassword) {
        const response: NewPasswordResDto =
          AppResponse.setUserErrorResponse<NewPasswordResDto>(
            'The password and confirm password are not correct format',
          );
        return response;
      }

      const hashPassword = Bcrypt.handleHashPassword(newPassword);
      const result = await this._accountRepository
        .createQueryBuilder()
        .update(Account)
        .set({
          isValidOtp: false,
          password: hashPassword,
        })
        .where('phonenumber = :phonenumber', { phonenumber: phonenumber })
        .execute();

      const response: NewPasswordResDto =
        AppResponse.setSuccessResponse<NewPasswordResDto>(result.affected);
      return response;
    } catch (error) {
      const response: NewPasswordResDto =
        AppResponse.setAppErrorResponse<NewPasswordResDto>(error.message);
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
}
