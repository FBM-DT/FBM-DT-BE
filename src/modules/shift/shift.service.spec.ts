import { Test } from '@nestjs/testing';
import { ShiftService } from './shift.service';
import { ShiftModule } from './shift.module';
import { AddShiftReqDto } from './dto/request';
import { AddShiftResDto } from './dto/response';
import { DatabaseModule } from '../../../src/db/database.module';
import { ConfigModule } from '@nestjs/config';

describe('ShiftService', () => {
  let service: ShiftService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
        ShiftModule,
        DatabaseModule,
      ],
      providers: [ShiftService],
    }).compile();

    service = module.get<ShiftService>(ShiftService);
  });

  describe('Create new work shift', () => {
    it('should be created', async () => {
      const result: AddShiftResDto = new AddShiftResDto();
      result.data = 1;
      result.message = 'Success';
      result.version = 'v1';
      result.status = 201;
      const dto: AddShiftReqDto = {
        shift: {
          name: 'test',
          repeatDays: [0, 1, 2, 3, 4, 5, 6],
          startTime: '06:00',
          endTime: '12:00',
          departmentId: 1,
        },
      };
      jest
        .spyOn(service, 'createShift')
        .mockImplementation(async () => result);
      expect(await service.createShift(dto)).toEqual({
        message: 'Success',
        status: 201,
        data: 1,
        version: 'v1',
      });
    });
  });
});
