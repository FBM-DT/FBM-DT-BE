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

  async getProfiles(queries: GetProfilesReqDto): Promise<AddProfileResDto> {
    const res: AddProfileResDto = new AddProfileResDto();
    try {
      if (Object.keys(queries).length > 0) {
        const options: FindManyOptions = new Object();

        ExtraQuery.paginateBy(
          {
            page: queries.page,
            pageSize: queries.pageSize,
          },
          options,
        );
        ExtraQuery.sortBy<User>(queries.sort, options);
        ExtraQuery.searchBy<User>(
          {
            address: queries?.address?.toLowerCase(),
            fullname: queries?.fullname,
            email: queries?.email?.toLowerCase(),
          },
          options,
        );

        ExtraQuery.searchByEnum<User>(
          {
            gender: GENDER[queries.gender?.toUpperCase()],
            department: DEPARTMENT[queries.department?.toUpperCase()],
          },
          options,
          SEARCH_TYPE.AND,
        );

        const result: User[] = await this._userRepository.find(options);

        if (result.length === 0) {
          AppResponse.setUserErrorResponse<GetProfileListResDto>(
            res,
            `Can not find user with ${JSON.stringify(queries)}`,
          );
          return res;
        }

        AppResponse.setSuccessResponse<GetProfileListResDto>(res, result, {
          page: queries.page,
          pageSize: queries.pageSize,
        });
        return res;
      }
      const result: User[] = await this._userRepository.find();

      AppResponse.setSuccessResponse<GetProfileListResDto>(res, result);
      return res;
    } catch (error) {
      AppResponse.setAppErrorResponse(res, error.message);
      return res;
    }
  }

  async findProfileById(id: number): Promise<AddProfileResDto> {
    const res: AddProfileResDto = new AddProfileResDto();
    try {
      const user = await this._userRepository.findOneBy({
        id: id,
      });
      AppResponse.setSuccessResponse(res, user);
      return res;
    } catch (error) {
      AppResponse.setAppErrorResponse(res, error.message);
    }
  }

  async update(
    id: number,
    updateProfileDto: UpdateProfileReqDto,
  ): Promise<UpdateProfileResDto> {
    const res: UpdateProfileResDto = new UpdateProfileResDto();
    try {
      const user = await this._userRepository.findOneBy({
        id: id,
      });
      if (!user) {
        AppResponse.setAppErrorResponse(
          res,
          errorMessageRes.cannotFindById(id, 'User'),
        );
        return res;
      }

      await this._userRepository
        .createQueryBuilder()
        .update(User)
        .set(updateProfileDto)
        .where('id = :id', { id: id })
        .execute();

      const userUpdated = await this._userRepository.findOneBy({
        id: id,
      });

      AppResponse.setSuccessResponse<UpdateProfileResDto>(res, userUpdated);
      return res;
    } catch (error) {
      AppResponse.setAppErrorResponse<UpdateProfileResDto>(res, error.message);
      return res;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }

  async getEmail(email: string): Promise<User> {
    const res: User = await this._userRepository.findOneBy({
      email: email,
    });
    return res;
  }
}
