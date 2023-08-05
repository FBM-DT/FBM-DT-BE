import { Inject, Injectable } from '@nestjs/common';
import { TYPEORM } from '../../core/constants';
import { DataSource } from 'typeorm';
import { AddUserProfileResDto } from './dto/response';
import { AppResponse } from '../../core/shared/app.response';
import { AddUserProfileReqDto } from './dto/request';
import { Account } from '../auth/account.entity';
import { User } from './user.entity';
import { IExistDataReturnValue } from './interface';
import * as bcrypt from 'bcrypt';
import { ErrorHandler } from '../../core/shared/common/error';

@Injectable()
export class UsersService {
  private _dataSource: DataSource;
  constructor(
    @Inject(TYPEORM)
    dataSource: DataSource,
  ) {
    this._dataSource = dataSource;
  }

  async addProfileUser(
    data: AddUserProfileReqDto,
  ): Promise<AddUserProfileResDto> {
    try {
      const isExistPhoneNumber: IExistDataReturnValue =
        await this.isExistUserProfileData({
          phonenumber: data.phonenumber,
        });

      if (isExistPhoneNumber.isExist) {
        return AppResponse.setUserErrorResponse<AddUserProfileResDto>(
          isExistPhoneNumber.message,
        );
      }
      const isExistEmail: IExistDataReturnValue =
        await this.isExistUserProfileData({
          email: data.email,
        });

      if (isExistEmail.isExist) {
        return AppResponse.setUserErrorResponse<AddUserProfileResDto>(
          isExistEmail.message,
        );
      }
      const { password, phonenumber, roleId, ...profile } = data;
      const hashPassword = this.handleHashPassword(password);

      const accountData: Account = new Account();
      accountData.password = hashPassword;
      accountData.phonenumber = data.phonenumber;
      accountData.roleId = data.roleId;

      const userData: User = new User();
      Object.assign(userData, profile);

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
        accountData.userId = addUserProfileResult.identifiers[0].id;
        const addAccountResult = await querryRunner.manager
          .getRepository(Account)
          .createQueryBuilder()
          .insert()
          .into(Account)
          .values(accountData)
          .execute();
        await querryRunner.commitTransaction();
        return AppResponse.setSuccessResponse<AddUserProfileResDto>(
          {
            user: addAccountResult.identifiers[0].id,
            account: addAccountResult.identifiers[0].id,
          },
          {
            status: 201,
            message: 'Created',
          },
        );
      } catch (error) {
        await querryRunner.rollbackTransaction();
        throw error;
      } finally {
        querryRunner.release();
      }
    } catch (error) {
      return AppResponse.setAppErrorResponse<AddUserProfileResDto>(
        error.message,
      );
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

  private handleHashPassword(password: string) {
    const saltOrRounds = 10;
    const hashPassword = bcrypt.hashSync(password, saltOrRounds);
    return hashPassword;
  }
}
