import { Injectable, Inject } from '@nestjs/common';
import { User } from '../users/user.entity';
import { DataSource, Repository } from 'typeorm';
import { TYPEORM } from '../../core/constants';
import { AddProfileReqDto, UpdateProfileReqDto } from './dto/req';
import {
  AddProfileResDto,
  UpdateProfileResDto,
  GetProfileResDto,
} from './dto/res';
import { AppResponse } from '../../core/shared/app.response';
import { AccountService } from '../auth/services';
import { Account } from '../auth/account.entity';
import { ErrorHandler } from '../../core/shared/common/error';
import { IExistDataReturnValue } from './interfaces';
import { Bcrypt } from '../../core/utils';
import { IAccountPayload, IUserPayload } from './interfaces';
import { Account } from '../auth/account.entity';

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

    const userData = {
      ...rest,
    };

    const account = {
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
      const test = await this._dataSource.getRepository(Account).findOne({
        where: { id: accountId },
        relations: ['user', 'role'],
      });
      if (!test)
        return AppResponse.setAppErrorResponse<GetProfileResDto>(
          ErrorHandler.notFound(`Account ${accountId}`),
          {
            status: 404,
          },
        );
      console.log(
        '🚀 ~ file: profile.service.ts:89 ~ ProfileService ~ test ~ test:',
        test,
      );

      const { id, ...profileData } = {
        ...test.user,
        accountId: test.id,
        userId: test.user.id,
        role: test.role.name,
      };

      return AppResponse.setSuccessResponse<GetProfileResDto>(profileData, {
        message: 'Success',
      });
    } catch (error) {
      return AppResponse.setAppErrorResponse(error.message);
    }
  }
}
