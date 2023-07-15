import { Injectable, Inject } from '@nestjs/common';
import { User } from '../users/user.entity';
import { DataSource, Repository } from 'typeorm';
import { TYPEORM } from 'src/core/constants';
import { AddProfileReqDto, UpdateProfileReqDto } from './dto/req';
import { AddProfileResDto, UpdateProfileResDto } from './dto/res';
import { AppResponse } from 'src/core/shared/app.response';

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
    }
  }

  async getAllProfile(): Promise<AddProfileResDto> {
    const res: AddProfileResDto = new AddProfileResDto();
    try {
      const users = await this._userRepository.find();
      AppResponse.setSuccessResponse(res, users);
      return res;
    } catch (error) {
      AppResponse.setAppErrorResponse(res, error.message);
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
        AppResponse.setAppErrorResponse(res, 'Not found');
        return res;
      }
      const updatedUser = await this._userRepository
        .createQueryBuilder()
        .update(User)
        .set(updateProfileDto)
        .where('id = :id', { id: id })
        .execute();

      AppResponse.setSuccessResponse(res, updatedUser);
      return res;
    } catch (error) {
      AppResponse.setAppErrorResponse(res, error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
