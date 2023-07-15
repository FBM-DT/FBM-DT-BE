import { Injectable, Inject } from '@nestjs/common';
import { User } from '../users/user.entity';
import { DataSource, Repository, FindManyOptions } from 'typeorm';
import { GENDER, SEARCH_TYPE, TYPEORM, DEPARTMENT } from 'src/core/constants';
import { AddProfileReqDto, UpdateProfileReqDto } from './dto/req';
import {
  AddProfileResDto,
  GetProfileListResDto,
  UpdateProfileResDto,
} from './dto/res';
import { AppResponse } from 'src/core/shared/app.response';
import GetProfilesReqDto from './dto/req/profile.dto';
import { ExtraQuery } from 'src/core/utils';
import { errorMessageRes } from './../../core/shared/response/errorMessage';

@Injectable()
export class ProfileService {
  private _userRepository: Repository<User>;
  private _dataSource: DataSource;
  constructor(
    @Inject(TYPEORM)
    dataSource: DataSource,
  ) {
    this._dataSource = dataSource;
    this._userRepository = dataSource.getRepository(User);
  }
  async createProfile(data: AddProfileReqDto): Promise<AddProfileResDto> {
    const res: AddProfileResDto = new AddProfileResDto();
    try {
      const user = await this._userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(data)
        .execute();

      AppResponse.setSuccessResponse(res, user.identifiers[0].id, {
        message: 'Created',
        status: 201,
      });
      return res;
    } catch (error) {
      AppResponse.setAppErrorResponse(res, error.message);
      return res;
    }
  }
}
