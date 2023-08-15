import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TYPEORM } from '../../core/constants';
import { AppResponse } from '../../core/shared/app.response';
import { Role } from './role.entity';
import { GetRolesResDto } from './dto/response/role.dto';

@Injectable()
export class RoleService {
  private readonly _roleRepository: Repository<Role>;
  private _dataSource: DataSource;

  constructor(@Inject(TYPEORM) dataSource: DataSource) {
    this._dataSource = dataSource;
    this._roleRepository = this._dataSource.getRepository(Role);
  }

  async getAll(): Promise<GetRolesResDto> {
    try {
      const roles = await this._roleRepository.find();
      return AppResponse.setSuccessResponse<GetRolesResDto>(roles);
    } catch (error) {
      return AppResponse.setAppErrorResponse<GetRolesResDto>(error.message);
    }
  }
}
