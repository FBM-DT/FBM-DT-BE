import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository, UpdateResult } from 'typeorm';
import { Department } from '../entities/department.entity';
import { TYPEORM } from '../../../core/constants';
import {
  AddDepartmentResDto,
  GetDepartmentListResDto,
  UpdateDepartmentResDto,
} from '../dto/department/res';
import { AppResponse } from '../../../core/shared/app.response';
import {
  AddDepartmentReqDto,
  UpdateDepartmentReqDto,
} from '../dto/department/req';
import { ErrorHandler } from '../../../core/shared/common/error';
import { IDepartmentPayload } from '../interfaces';

@Injectable()
export class DepartmentService {
  private _departmentRepository: Repository<Department>;
  private _dataSource: DataSource;
  constructor(
    @Inject(TYPEORM)
    dataSource: DataSource,
  ) {
    this._dataSource = dataSource;
    this._departmentRepository = dataSource.getRepository(Department);
  }

  async getAllDepartment(): Promise<GetDepartmentListResDto> {
    try {
      const data: IDepartmentPayload[] =
        await this._departmentRepository.find();
      return AppResponse.setSuccessResponse<GetDepartmentListResDto>(data);
    } catch (error) {
      return AppResponse.setAppErrorResponse<GetDepartmentListResDto>(
        error.message,
      );
    }
  }

  async createDepartment(
    data: AddDepartmentReqDto,
  ): Promise<AddDepartmentResDto> {
    try {
      const result = await this._departmentRepository
        .createQueryBuilder()
        .insert()
        .into(Department)
        .values(data)
        .execute();

      const test = {
        departmentId: result.identifiers[0].id,
      };
      return AppResponse.setSuccessResponse<AddDepartmentResDto>(test, {
        status: 201,
        message: 'Created',
      });
    } catch (error) {
      return AppResponse.setAppErrorResponse<AddDepartmentResDto>(
        error.message,
      );
    }
  }

  async updateDepartment(
    departmentId: number,
    data: UpdateDepartmentReqDto,
  ): Promise<UpdateDepartmentResDto> {
    const department: IDepartmentPayload =
      await this._departmentRepository.findOne({
        where: { id: departmentId },
      });

    if (!department) {
      return AppResponse.setUserErrorResponse(
        ErrorHandler.invalid(`Department with id ${departmentId}`),
        {
          status: 400,
        },
      );
    }
    try {
      const result = await this._departmentRepository
        .createQueryBuilder()
        .update(Department)
        .set(data)
        .where('id = :id', { id: departmentId })
        .execute();

      const updatedDepartment: IDepartmentPayload =
        await this._departmentRepository.findOne({
          where: { id: departmentId },
        });

      return AppResponse.setSuccessResponse<UpdateDepartmentResDto>(
        updatedDepartment,
        {
          status: 200,
          message: 'Updated',
        },
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse<UpdateDepartmentResDto>(
        error.message,
      );
    }
  }

  async activeDepartment(departmentId: number) {
    const department: IDepartmentPayload =
      await this._departmentRepository.findOne({
        where: { id: departmentId },
      });

    if (!department) {
      return AppResponse.setUserErrorResponse(
        ErrorHandler.invalid(`Department with id ${departmentId}`),
        {
          status: 400,
        },
      );
    }
    try {
      const result = await this._departmentRepository
        .createQueryBuilder()
        .update(Department)
        .set({ isActive: true })
        .where('id = :id', { id: departmentId })
        .execute();

      const updatedDepartment: IDepartmentPayload =
        await this._departmentRepository.findOne({
          where: { id: departmentId },
        });

      return AppResponse.setSuccessResponse<UpdateDepartmentResDto>(
        updatedDepartment,
        {
          status: 200,
          message: 'Updated successfully',
        },
      );
    } catch (error) {
      return AppResponse.setAppErrorResponse<UpdateDepartmentResDto>(
        error.message,
      );
    }
  }

  async deActiveDepartment(departmentId: number) {
    const department: IDepartmentPayload =
      await this._departmentRepository.findOne({
        where: { id: departmentId },
      });

    if (!department) {
      return AppResponse.setUserErrorResponse(
        ErrorHandler.invalid(`Department with id ${departmentId}`),
        {
          status: 400,
        },
      );
    }
    try {
      const result = await this._departmentRepository
        .createQueryBuilder()
        .update(Department)
        .set({ isActive: false })
        .where('id = :id', { id: departmentId })
        .execute();

      return AppResponse.setSuccessResponse<UpdateDepartmentResDto>({
        status: 200,
        message: 'Updated successfully',
      });
    } catch (error) {
      return AppResponse.setAppErrorResponse<UpdateDepartmentResDto>(
        error.message,
      );
    }
  }
}
