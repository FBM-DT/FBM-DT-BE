import { Injectable, Inject } from '@nestjs/common';
import { User } from '../users/user.entity';
import { DataSource, Repository } from 'typeorm';
import { TYPEORM } from '../../core/constants';
import { AddProfileReqDto, UpdateProfileReqDto } from './dto/req';
import { AddProfileResDto, UpdateProfileResDto } from './dto/res';
import { AppResponse } from '../../core/shared/app.response';
import { AccountService } from '../auth/services';
import { ErrorHandler } from '../../core/shared/common/error';

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
      const user = await this._userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(userData)
        .execute();

      if (user && user.identifiers.length > 0) {
        const accountData = {
          ...account,
          userId: user.identifiers[0].id,
        };

        const accountRes = await this.accountService.createAccount(accountData);
        if (accountRes.status === 400 || accountRes.status === 500) {
          await this._userRepository.delete(user.identifiers[0].id);
          return accountRes;
        }

        const { password, ...createdData } = {
          ...rest,
          ...accountData,
          accountId: accountRes.data,
        };

        return AppResponse.setSuccessResponse<AddProfileResDto>(createdData, {
          status: 201,
          message: 'Created',
        });
      }
    } catch (error) {
      if (error.message.includes('duplicate key')) {
        return AppResponse.setAppErrorResponse<AddProfileResDto>(
          'Email existed',
        );
      }
      return AppResponse.setAppErrorResponse<AddProfileResDto>(error.message);
    }
  }

  async updateProfileById(
    accountID: number,
    data: UpdateProfileReqDto,
  ): Promise<UpdateProfileResDto> {
    const { roleId, phonenumber, ...rest } = data;

    const userData = {
      ...rest,
    };

    const account = {
      roleId,
      phonenumber,
    };

    try {
      const accountRes = await this.accountService.updateAccount(
        accountID,
        account,
      );
      if (accountRes.status === 400 || accountRes.status === 500) {
        return accountRes;
      }

      const accountFindById = await this.accountService.getAccountById(
        accountID,
      );

      const accountUserData = accountFindById.data['user'];

      const user = await this._userRepository
        .createQueryBuilder()
        .update(User)
        .set(userData)
        .where('id = :id', { id: accountUserData.id })
        .execute();

      if (user && user.affected === 0)
        return AppResponse.setAppErrorResponse<any>(
          ErrorHandler.notFound(`User ${accountUserData.id}`),
        );

      const updatedData = {
        ...rest,
        ...account,
      };

      return AppResponse.setSuccessResponse<any>(updatedData, {
        status: 200,
        message: 'Updated',
      });
    } catch (error) {
      if (error.message.includes('duplicate key')) {
        return AppResponse.setAppErrorResponse<any>('Email existed');
      }
      return AppResponse.setAppErrorResponse<any>(error.message);
    }
  }
}
