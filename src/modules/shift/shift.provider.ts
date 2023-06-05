import { IWorkShiftRepository } from '../../core/abstraction';
import { WorkShift } from './entities/work-shift.entity';
import { DataSource } from 'typeorm';
import { Inject } from '@nestjs/common';
import { TYPEORM } from '../../core/constants';
export class ShiftRepository implements IWorkShiftRepository {
  private _db: DataSource;
  constructor(
    @Inject(TYPEORM)
    dataSource: DataSource,
  ) {
    this._db = dataSource;
  }
  async add(data: Object): Promise<number> {
    try {
      await this._db.initialize();
      const response = await this._db.transaction(
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
        '🚀 ~ file: shift.provider.ts:20 ~ ShiftRepository ~ add ~ error:',
        error.message,
      );
      return 0;
    } finally {
      await this._db.destroy();
    }
  }
  update(data: Object, id: number): Promise<number> {
    throw new Error('Method not implemented.');
  }
  delete(id: number): Promise<number> {
    throw new Error('Method not implemented.');
  }
  findAll(): Promise<WorkShift[]> {
    throw new Error('Method not implemented.');
  }
  findManyByConditions(conditions: Object): Promise<WorkShift[]> {
    throw new Error('Method not implemented.');
  }
  findOneById(id: number): Promise<WorkShift> {
    throw new Error('Method not implemented.');
  }
  findOneByConditions(conditions: Object): Promise<WorkShift> {
    throw new Error('Method not implemented.');
  }
}
