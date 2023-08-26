import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TYPEORM } from '@BE/core/constants';
import { DataSource, Repository } from 'typeorm';
import { AppResponse } from '@BE/core/shared/app.response';
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
import { ErrorHandler } from '@BE/core/shared/common/error';
import { ErrorMessage } from '../constants/errorMessages';
import { Bcrypt } from '@BE/core/utils';
import { User } from '../../users/user.entity';

@Injectable()
export class AccountService {
  private _accountRepository: Repository<Account>;
  private _userRepository: Repository<User>;
  private _dataSource: DataSource;
  constructor(@Inject(TYPEORM) dataSource: DataSource) {
    this._dataSource = dataSource;
    this._accountRepository = dataSource.getRepository(Account);
    this._userRepository = dataSource.getRepository(User);
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

      return AppResponse.setSuccessResponse<GetAllAccountsResDto>(account);
    } catch (error) {
      return AppResponse.setAppErrorResponse<GetAllAccountsResDto>(
        error.message,
      );
    }
  }

  async getAccountById(id: number): Promise<GetAccountResDto> {
    try {
      const account = await this._accountRepository.findOne({
        where: { id },
        relations: ['user', 'role'],
      });
      if (!account) {
        return AppResponse.setUserErrorResponse<GetAccountResDto>(
          ErrorHandler.notFound(`Account ${id}`),
        );
      }

      return AppResponse.setSuccessResponse<GetAccountResDto>(account);
    } catch (error) {
      return AppResponse.setAppErrorResponse<GetAccountResDto>(error.message);
    }
  }

  async getAccountByPhoneNumber(phoneNumber: string): Promise<Account | null> {
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
      const { phonenumber, password, userId } = payload;

      const userData = await this._userRepository.findOne({
        where: { id: userId },
      });

      if (!userData.isActive) {
        return AppResponse.setUserErrorResponse<CreateAccountResDto>(
          ErrorMessage.USER_HAS_BEEN_DEACTIVATED,
        );
      }

      const existPhoneNumber = await this._accountRepository.findOne({
        where: { phonenumber },
      });

      if (phonenumber === existPhoneNumber?.phonenumber) {
        return AppResponse.setUserErrorResponse<CreateAccountResDto>(
          ErrorHandler.alreadyExists('The phone number'),
        );
      }

      const hashPassword = Bcrypt.handleHashPassword(password);
      const data = { ...payload, password: hashPassword };
      const account = await this._accountRepository
        .createQueryBuilder()
        .insert()
        .into(Account)
        .values(data)
        .execute();

      return AppResponse.setSuccessResponse<CreateAccountResDto>(
        account.identifiers[0].id,
        {
          status: 201,
          message: 'Created',
        },
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse<CreateAccountResDto>(
        error.message,
      );
    }
  }

  async updateAccount(
    accountId: number,
    accountDto: UpdateAccountReqDto,
  ): Promise<UpdateAccountResDto> {
    try {
      const { phonenumber, password } = accountDto;
      const existPhoneNumber = await this._accountRepository.findOne({
        where: { phonenumber },
      });

      if (phonenumber === existPhoneNumber?.phonenumber) {
        return AppResponse.setUserErrorResponse<UpdateAccountResDto>(
          ErrorHandler.alreadyExists('The phone number'),
        );
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

        return AppResponse.setSuccessResponse<UpdateAccountResDto>(
          result.affected,
        );
      }

      const newPassword: string = Bcrypt.handleHashPassword(password);
      const account = { ...accountDto, password: newPassword };
      const result = await this._accountRepository
        .createQueryBuilder('account')
        .update(Account)
        .where('account.id = :accountId', { accountId: accountId })
        .set(account)
        .execute();
      return AppResponse.setSuccessResponse<UpdateAccountResDto>(
        result.affected,
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse<UpdateAccountResDto>(
        error.message,
      );
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
        return AppResponse.setUserErrorResponse<ChangePasswordResDto>(
          ErrorHandler.notFound(`Account ${accountId}`),
        );
      }

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        account?.password,
      );

      if (!isValidPassword) {
        return AppResponse.setUserErrorResponse<ChangePasswordResDto>(
          ErrorHandler.invalid('The current password'),
        );
      }

      if (confirmPassword !== newPassword) {
        return AppResponse.setUserErrorResponse<ChangePasswordResDto>(
          ErrorHandler.invalid('The confirm password'),
        );
      }

      const isValidFormatPassword = await Bcrypt.isPasswordValid(newPassword);
      if (isValidFormatPassword === false) {
        return AppResponse.setUserErrorResponse<ChangePasswordResDto>(
          'The password and confirm password are not correct format',
        );
      }

      const hashPassword = Bcrypt.handleHashPassword(newPassword);
      const result = await this._accountRepository.update(accountId, {
        password: hashPassword,
      });

      return AppResponse.setSuccessResponse<ChangePasswordResDto>(
        result.affected,
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse<ChangePasswordResDto>(
        error.message,
      );
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
        return AppResponse.setUserErrorResponse<NewPasswordResDto>(
          ErrorHandler.notFound(`The phone number ${phonenumber}`),
        );
      }

      if (!account.isValidOtp) {
        return AppResponse.setUserErrorResponse<NewPasswordResDto>(
          ErrorHandler.invalid('The OTP'),
          {
            data: {
              status: 'rejected',
              message: 'You need to verify OTP first',
            },
          },
        );
      }

      if (confirmPassword !== newPassword) {
        return AppResponse.setUserErrorResponse<NewPasswordResDto>(
          ErrorHandler.invalid('The confirm password'),
        );
      }

      const isValidFormatPassword = await Bcrypt.isPasswordValid(newPassword);
      if (!isValidFormatPassword) {
        return AppResponse.setUserErrorResponse<NewPasswordResDto>(
          'The password and confirm password are not correct format',
        );
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

      return AppResponse.setSuccessResponse<NewPasswordResDto>(result.affected);
    } catch (error) {
      return AppResponse.setAppErrorResponse<NewPasswordResDto>(error.message);
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
