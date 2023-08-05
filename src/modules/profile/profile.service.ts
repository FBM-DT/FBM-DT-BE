import { Injectable, Inject } from '@nestjs/common';
import { User } from '../users/user.entity';
import { DataSource, Repository } from 'typeorm';
import { TYPEORM } from '../../core/constants';
import { AddProfileReqDto, UpdateProfileReqDto } from './dto/req';
import {
  AddProfileResDto,
  GetProfileResDto,
  UpdateProfileResDto,
} from './dto/res';
import { AppResponse } from '../../core/shared/app.response';
import { AccountService } from '../auth/services';
import { Account } from '../auth/account.entity';
import { ErrorHandler } from '../../core/shared/common/error';
import { IExistDataReturnValue } from './interfaces';
import { Bcrypt } from '../../core/utils';
import { IAccountPayload, IUserPayload } from './interfaces';

@Injectable()
export class ProfileService {
  private _userRepository: Repository<User>;
  private _dataSource: DataSource;
  constructor(
    @Inject(TYPEORM)
    dataSource: DataSource,
    private readonly accountService: AccountService,
  ) {
    this._dataSource = dataSource;
    this._userRepository = dataSource.getRepository(User);
  }

  async createProfile(data: AddProfileReqDto): Promise<AddProfileResDto> {
    const { phonenumber, password, roleId, ...rest } = data;

    const userData: IUserPayload = {
      ...rest,
    };

    const account: IAccountPayload = {
      phonenumber,
      password,
      roleId,
    };

    try {
      const isExistPhoneNumber: IExistDataReturnValue =
        await this.isExistUserProfileData({
          phonenumber: data.phonenumber,
        });
      if (isExistPhoneNumber.isExist) {
        return AppResponse.setUserErrorResponse<AddProfileResDto>(
          isExistPhoneNumber.message,
        );
      }
      const isExistEmail: IExistDataReturnValue =
        await this.isExistUserProfileData({
          email: data.email,
        });

      if (isExistEmail.isExist) {
        return AppResponse.setUserErrorResponse<AddProfileResDto>(
          isExistEmail.message,
        );
      }

      const isValidPassword = Bcrypt.isPasswordValid(account.password);
      if (!isValidPassword) {
        return AppResponse.setUserErrorResponse<AddProfileResDto>(
          ErrorHandler.invalid('Password'),
        );
      }
      const hashPassword = Bcrypt.handleHashPassword(account.password);

      account.password = hashPassword;

      const querryRunner = this._dataSource.createQueryRunner();

      try {
        await querryRunner.connect();
        await querryRunner.startTransaction('SERIALIZABLE');

        const addUserProfileResult = await querryRunner.manager
          .getRepository(User)
          .createQueryBuilder()
          .insert()
          .into(User)
          .values(userData)
          .execute();

        const accountData = {
          ...account,
          userId: addUserProfileResult.identifiers[0].id,
        };
        const addAccountResult = await querryRunner.manager
          .getRepository(Account)
          .createQueryBuilder()
          .insert()
          .into(Account)
          .values(accountData)
          .execute();
        await querryRunner.commitTransaction();

        const { password, ...createdData } = {
          ...rest,
          ...accountData,
          accountId: addAccountResult.identifiers[0].id,
        };

        return AppResponse.setSuccessResponse<AddProfileResDto>(createdData, {
          status: 201,
          message: 'Created',
        });
      } catch (error) {
        await querryRunner.rollbackTransaction();
        throw error;
      } finally {
        await querryRunner.release();
      }
    } catch (error) {
      return AppResponse.setAppErrorResponse<AddProfileResDto>(error.message);
    }
  }

  private async isExistUserProfileData(
    dataObject: Object,
  ): Promise<IExistDataReturnValue> {
    const accountTableFields: Array<string> = this._dataSource
      .getMetadata(Account)
      .columns.map((column) => column.propertyName);
    const userTableFields: Array<string> = this._dataSource
      .getMetadata(User)
      .columns.map((column) => column.propertyName);
    try {
      if (accountTableFields.includes(Object.keys(dataObject)[0])) {
        const existUserAccount = await this._dataSource
          .getRepository(Account)
          .find({ where: dataObject });
        if (existUserAccount.length > 0) {
          return {
            isExist: true,
            message: ErrorHandler.alreadyExists(
              Object.getOwnPropertyNames(dataObject).toString(),
            ),
          };
        }
      }
      if (userTableFields.includes(Object.keys(dataObject)[0])) {
        const existUserInfor = await this._dataSource
          .getRepository(User)
          .find({ where: dataObject });
        if (existUserInfor.length > 0) {
          return {
            isExist: true,
            message: ErrorHandler.alreadyExists(
              Object.getOwnPropertyNames(dataObject).toString(),
            ),
          };
        }
      }
      return {
        isExist: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async getProfile(accountId: number): Promise<GetProfileResDto> {
    try {
      const account = await this._dataSource.getRepository(Account).findOne({
        where: { id: accountId },
        relations: ['user', 'role'],
      });
      if (!account)
        return AppResponse.setAppErrorResponse<GetProfileResDto>(
          ErrorHandler.notFound(`Account ${accountId}`),
          {
            status: 404,
          },
        );

      const { id, ...profileData } = {
        ...account.user,
        accountId: account.id,
        userId: account.user.id,
        role: account.role.name,
      };

      return AppResponse.setSuccessResponse<GetProfileResDto>(profileData, {
        message: 'Success',
      });
    } catch (error) {
      return AppResponse.setAppErrorResponse(error.message);
    }
  }

  async updateProfile(
    accountID: number,
    data: UpdateProfileReqDto,
  ): Promise<UpdateProfileResDto> {
    const { roleId, phonenumber, ...rest } = data;

    const userData: IUserPayload = {
      ...rest,
    };

    const account = {
      roleId,
      phonenumber,
    };

    const querryRunner = this._dataSource.createQueryRunner();

    try {
      await querryRunner.connect();
      await querryRunner.startTransaction('SERIALIZABLE');

      const isHaveAccount = await this._dataSource
        .getRepository(Account)
        .findOneBy({
          id: accountID,
        });

      if (!isHaveAccount) {
        await querryRunner.rollbackTransaction();

        return AppResponse.setAppErrorResponse<UpdateProfileResDto>(
          ErrorHandler.notFound(`Account with id ${accountID}`),
          {
            status: 404,
          },
        );
      }

      const isExistPhoneNumber: IExistDataReturnValue =
        await this.isExistUserProfileData({
          phonenumber: data.phonenumber,
        });

      if (isExistPhoneNumber.isExist) {
        await querryRunner.rollbackTransaction();

        return AppResponse.setUserErrorResponse<AddProfileResDto>(
          isExistPhoneNumber.message,
        );
      }
      const isExistEmail: IExistDataReturnValue =
        await this.isExistUserProfileData({
          email: data.email,
        });

      if (isExistEmail.isExist) {
        await querryRunner.rollbackTransaction();

        return AppResponse.setUserErrorResponse<AddProfileResDto>(
          isExistEmail.message,
        );
      }

      const accountUpdateData = await this._dataSource
        .getRepository(Account)
        .createQueryBuilder()
        .update(Account)
        .set(account)
        .where('id = :id', { id: accountID })
        .execute();

      const accountAfterUpdate = await this._dataSource
        .getRepository(Account)
        .findOne({ where: { id: accountID } });

      const { ...updatedAccountData } = accountAfterUpdate;

      const user = await this._userRepository
        .createQueryBuilder()
        .update(User)
        .set(userData)
        .where('id = :id', { id: updatedAccountData.userId })
        .execute();

      await querryRunner.commitTransaction();

      const finalResult = {
        ...rest,
        ...account,
        accountId: updatedAccountData.id,
        userId: updatedAccountData.userId,
      };

      return AppResponse.setSuccessResponse<UpdateProfileResDto>(finalResult, {
        status: 200,
        message: 'Updated',
      });
    } catch (error) {
      await querryRunner.rollbackTransaction();
      return AppResponse.setAppErrorResponse<UpdateProfileResDto>(
        error.message,
      );
    } finally {
      await querryRunner.release();
    }
  }
}
