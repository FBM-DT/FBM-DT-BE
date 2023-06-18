import { Test } from '@nestjs/testing';
import { ShiftService } from './shift.service';
import { ShiftModule } from './shift.module';
import { AddWorkShiftRequestDto, AddWorkShiftResponseDto } from './dto';
import { WORKTYPE } from '../../../src/core/constants';
import { DatabaseModule } from '../../../src/db/database.module';

describe('ShiftService', () => {
  let service: ShiftService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ShiftModule, DatabaseModule],
      providers: [ShiftService],
    }).compile();

    service = module.get<ShiftService>(ShiftService);
  });

  describe('Create new work shift', () => {
    it('should be created', async () => {
      const result: AddWorkShiftResponseDto = new AddWorkShiftResponseDto();
      result.data = 1;
      result.message = 'Success';
      result.version = 'v1'
      result.status = 201;
      const dto: AddWorkShiftRequestDto = {
        name: 'test',
        address: '55 Hardvard',
        duration: '1y',
        type: WORKTYPE.DAILY,
        description: 'test',
      };
      jest
        .spyOn(service, 'createWorkShift')
        .mockImplementation(async () => result[0]);
      expect(await service.createWorkShift(dto)).toEqual({
        message: 'Success',
        status: 201,
        data: 1,
        version: 'v1'
      });
    });
  });
});
