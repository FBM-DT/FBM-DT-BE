import { Injectable } from '@nestjs/common';
import { IWorkShiftRepository } from '../../core/abstraction';
import { ShiftRepository } from './shift.provider';
import { AddWorkShiftRequestDto } from './dto';

@Injectable()
export class ShiftService {
  private _repository: IWorkShiftRepository;
  constructor(wsRepository: ShiftRepository) {
    this._repository = wsRepository;
  }

  async createWorkShift(data: AddWorkShiftRequestDto): Promise<Object> {
    try {
      const response = await this._repository.add(data);
      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: shift.service.ts:17 ~ ShiftService ~ createWorkShift ~ error:',
        error,
      );
    }
  }
}
