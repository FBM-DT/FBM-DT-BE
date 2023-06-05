import { Test } from '@nestjs/testing';
import { ShiftService } from './shift.service';
import { ShiftModule } from './shift.module';
import { AddWorkShiftRequestDto } from './dto';
import { WORKTYPE } from '../../../src/core/constants';

describe('ShiftService', () => {
  let service: ShiftService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ShiftModule],
      providers: [ShiftService],
    }).compile();

    service = module.get<ShiftService>(ShiftService);
  });

  describe('Create new work shift', () => {
    it('should be created', async () => {
      const result = [1];
      const dto: AddWorkShiftRequestDto = {
        name: 'test',
        address: '55 Hardvard',
        duration: '1y',
        type: WORKTYPE.DAILY,
        description: 'test'
      }
      jest.spyOn(service, 'createWorkShift').mockImplementation(async ()=> result[0])
      expect(await service.createWorkShift(dto)).toBeCloseTo(1);
    })
  })
});
