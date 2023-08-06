import { Test } from '@nestjs/testing';
import { ShiftService } from './shift.service';
import { ShiftModule } from './shift.module';
import { AddWorkShiftReqDto } from './dto/request';
import { AddWorkShiftResDto } from './dto/response';
import { WORKTYPE } from '../../../src/core/constants';
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
      const result: AddWorkShiftResDto = new AddWorkShiftResDto();
      result.data = 1;
      result.message = 'Success';
      result.version = 'v1';
      result.status = 201;
      const dto: AddWorkShiftReqDto = {
        workShift:{
          name: 'test',
          address: '55 Harvard',
          duration: '1y',
          type: WORKTYPE.DAILY,
          description: 'test',
        }
        
      };
      jest
        .spyOn(service, 'createWorkShift')
        .mockImplementation(async () => result);
      expect(await service.createWorkShift(dto)).toEqual({
        message: 'Success',
        status: 201,
        data: 1,
        version: 'v1',
      });
    });
  });
});
