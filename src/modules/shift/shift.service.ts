import { Inject, Injectable } from '@nestjs/common';
import {
  AddWorkShiftRequestDto,
} from './dto';
import { TYPEORM } from '../../core/constants';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { WorkShift } from './entities/work-shift.entity';

@Injectable()
export class ShiftService {
  private _workShiftRepository: Repository<WorkShift>;
  constructor(
    @Inject(TYPEORM)
    private _db: DataSource,
  ) {
    this._workShiftRepository = _db.getRepository(WorkShift);
  }

  async createWorkShift(data: AddWorkShiftRequestDto): Promise<number> {
    try {
      await this._db.initialize();
      const response: number = await this._db.transaction(
        'SERIALIZABLE',
        async (transaction) => {
          const result = await transaction
            .getRepository(WorkShift)
            .createQueryBuilder()
            .insert()
            .into(WorkShift)
            .values(data)
            .execute();
          return result.identifiers[0].id;
        },
      );
      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: shift.service.ts:17 ~ ShiftService ~ createWorkShift ~ error:',
        error,
      );
    } finally {
      await this._db.destroy();
    }
  }

  async getWorkShiftList(): Promise<WorkShift[]> {
    try {
      await this._db.initialize();
      const response: WorkShift[] = await this._workShiftRepository.find();
      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: shift.service.ts:30 ~ ShiftService ~ getWorkShiftList ~ error:',
        error,
      );
    } finally {
      await this._db.destroy();
    }
  }

  async getAWorkShiftById(workShiftId: number): Promise<WorkShift> {
    try {
      await this._db.initialize();
      const response: WorkShift = await this._workShiftRepository.findOneBy({
        id: workShiftId,
      });
      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: shift.service.ts:41 ~ ShiftService ~ getAWorkShiftById ~ error:',
        error,
      );
    } finally {
      await this._db.destroy();
    }
  }

  async getWorkShiftFilteredList(
    option: FindManyOptions,
  ): Promise<WorkShift[]> {
    try {
      await this._db.initialize();
      const response: WorkShift[] =  await this._workShiftRepository.find(option);
      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: shift.service.ts:80 ~ ShiftService ~ getWorkShiftFilteredList ~ error:',
        error,
      );
    }finally{
      await this._db.destroy();
    }
  }
}
