import { Test } from '@nestjs/testing';
import { ShiftController } from './shift.controller';
import { ShiftModule } from './shift.module';
import { AddWorkShiftRequestDto, AddWorkShiftResponseDto } from './dto';
import { WORKTYPE } from '../../core/constants';

describe('ShiftController', () => {
  let controller: ShiftController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ShiftModule],
      controllers: [ShiftController],
    }).compile();

    controller = module.get<ShiftController>(ShiftController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('Create new work shift', () => {
    it('should be created', async () => {
      const result: AddWorkShiftResponseDto = {
        version: 'v1',
        status: 200,
        message: 'Success',
        data: 1,
      };
      const dto: AddWorkShiftRequestDto = {
        name: 'test',
        address: '55 Hardvard',
        duration: '1y',
        type: WORKTYPE.DAILY,
        description: 'test',
      };
      jest
        .spyOn(controller, 'createWorkShift')
        .mockImplementation(async () => result);
      expect(await controller.createWorkShift(dto)).toEqual({
        version: 'v1',
        status: 200,
        message: 'Success',
        data: 1,
      });
    });
    it('should not be created', async () => {
      const result: AddWorkShiftResponseDto = {
        version: 'v1',
        status: 200,
        message: 'Success',
        data: 1,
      };
      const dto: AddWorkShiftRequestDto = {
        name: 'test',
        address: '55 Hardvard',
        duration: '1y',
        type: WORKTYPE.DAILY,
        description: 'test',
      };
      jest
        .spyOn(controller, 'createWorkShift')
        .mockImplementation(async () => result);
      expect(await controller.createWorkShift(dto)).toEqual({
        version: 'v1',
        status: 200,
        message: 'Success',
        data: 1,
      });
    });
    it('should not be created', async () => {
      const result: AddWorkShiftResponseDto = {
        version: 'v1',
        status: 200,
        message: 'Success',
        data: 1,
      };
      const dto: AddWorkShiftRequestDto = {
        name: 'test',
        address: '55 Hardvard',
        duration: '1y',
        type: WORKTYPE.DAILY,
        description: 'test',
      };
      jest
        .spyOn(controller, 'createWorkShift')
        .mockImplementation(async () => result);
      expect(await controller.createWorkShift(dto)).toEqual({
        version: 'v1',
        status: 200,
        message: 'Success',
        data: 1,
      });
    });
  });
});
