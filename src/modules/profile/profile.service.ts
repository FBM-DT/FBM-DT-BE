import { Injectable, Inject } from '@nestjs/common';
import { User } from '../users/user.entity';
import { DataSource, Repository } from 'typeorm';
import { TYPEORM } from '../../core/constants';
import { AddProfileReqDto } from './dto/req';
import { AddProfileResDto, GetProfileResDto } from './dto/res';
import { AppResponse } from '../../core/shared/app.response';
import { AccountService } from '../auth/services';

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
  async getProfileById(profileId: number): Promise<GetProfileResDto> {
    try {
      const accountRes = await this.accountService.getAccountById(profileId);

      if (accountRes.status === 400 || accountRes.status === 500) {
        return accountRes;
      }
      const rawData = {
        ...accountRes.data['user'],
        accountId: accountRes.data['id'],
        userId: accountRes.data['user']['id'],
        role: accountRes.data['role']['name'],
      };

      const { id, ...finalData } = rawData;

      return AppResponse.setSuccessResponse<GetProfileResDto>(finalData, {
        message: 'Success',
      });
    } catch (error) {
      return AppResponse.setAppErrorResponse(error.message);
    }
  }
}
