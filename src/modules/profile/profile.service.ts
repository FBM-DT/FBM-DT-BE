import { Injectable, Inject } from '@nestjs/common';
import { User } from '../users/user.entity';
import { DataSource, Repository } from 'typeorm';
import { TYPEORM } from '../../core/constants';
import { AddProfileReqDto } from './dto/req';
import { AddProfileResDto, GetProfileResDto } from './dto/res';
import { AppResponse } from '../../core/shared/app.response';
import { AccountService } from '../auth/services';
import { Account } from '../auth/account.entity';
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
