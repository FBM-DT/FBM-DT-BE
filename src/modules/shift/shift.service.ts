import { Inject, Injectable } from '@nestjs/common';
import {
  AddWorkShiftRequestDto,
} from './dto';
import { CONNECTION } from '../../core/constants';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { WorkShift } from './entities/work-shift.entity';

@Injectable()
export class ShiftService {
  private _workShiftRepository: Repository<WorkShift>
  constructor(
    @Inject(CONNECTION)
    dataSource: DataSource
  ) {
    this._workShiftRepository = dataSource.getRepository(WorkShift)
  }

  async createWorkShift(data: AddWorkShiftRequestDto): Promise<number> {
    try {
      const response = await this._workShiftRepository.createQueryBuilder()
      .insert()
      .into(WorkShift)
      .values(data)
      .execute();
      return response.identifiers[0].id;
    } catch (error) {
      console.log(
        '🚀 ~ file: shift.service.ts:17 ~ ShiftService ~ createWorkShift ~ error:',
        error,
      );
    }
  }

  async getWorkShiftList(): Promise<WorkShift[]> {
    try {
      const response: WorkShift[] = await this._workShiftRepository.find();
      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: shift.service.ts:30 ~ ShiftService ~ getWorkShiftList ~ error:',
        error,
      );
    }
  }

  async getAWorkShiftById(workShiftId: number): Promise<WorkShift> {
    try {
      const response: WorkShift = await this._workShiftRepository.findOneBy({
        id: workShiftId,
      });
      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: shift.service.ts:41 ~ ShiftService ~ getAWorkShiftById ~ error:',
        error,
      );
    }
  }

  async getWorkShiftFilteredList(
    option: FindManyOptions,
  ): Promise<WorkShift[]> {
    try {
      const response: WorkShift[] =  await this._workShiftRepository.find(option);
      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: shift.service.ts:80 ~ ShiftService ~ getWorkShiftFilteredList ~ error:',
        error,
      );
    }
  }
}
