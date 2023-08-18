import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentService } from './department.service';
import { DatabaseModule } from '../../../../src/db/database.module';
import { ConfigModule } from '@nestjs/config';
import { Department } from '../entities/department.entity';
import { async } from 'rxjs';
import { AddDepartmentReqDto } from '../dto/department/req';
import { AddDepartmentResDto } from '../dto/department/res';

describe('DepartmentServiceTsService', () => {
  let service: DepartmentService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
        Department,
        DatabaseModule,
      ],
      providers: [DepartmentService],
    }).compile();

    service = module.get<DepartmentService>(DepartmentService);
  });

  describe('Create new department', () => {
    it('should be created', async () => {
      const data: AddDepartmentReqDto = {
        name: 'Department 1',
        address: '15 Mai Thuc Lan',
        openAt: '08:00',
        closeAt: '15:00',
      };

      const returnData: AddDepartmentResDto = new AddDepartmentResDto();
      returnData.data = data;
      returnData.message = 'Created';
      returnData.status = 201;
      returnData.version = 'v1';

      jest
        .spyOn(service, 'createDepartment')
        .mockImplementation(async () => returnData);

      expect(await service.createDepartment(data)).toEqual({
        message: 'Created',
        status: 201,
        data: data,
        version: 'v1',
      });
    });
  });

  describe('Get all department', () => {
    it('should be get all department', async () => {
      const mockDepartments: any[] = [
        {
          id: 1,
          name: 'Department 1',
          address: '15 Mai Thuc Lan',
          openAt: '08:00',
          closeAt: '15:00',
        },
        {
          id: 2,
          name: 'Department 2',
          address: '15 Mai Thuc Lan',
          openAt: '08:00',
          closeAt: '15:00',
        },
      ];

      const returnData: AddDepartmentResDto = new AddDepartmentResDto();
      returnData.data = mockDepartments;
      returnData.message = 'Success';
      returnData.status = 200;
      returnData.version = 'v1';

      jest
        .spyOn(service, 'getAllDepartment')
        .mockImplementation(async () => returnData);

      expect(await service.getAllDepartment()).toEqual({
        message: 'Success',
        status: 200,
        data: mockDepartments,
        version: 'v1',
      });
    });
  });

  describe('Update department', () => {
    it('should be update department', async () => {
      const mockDepartment: any = {
        id: 1,
        name: 'Department 1',
        address: '15 Mai Thuc Lan',
        openAt: '08:00',
        closeAt: '15:00',
      };

      const returnData: AddDepartmentResDto = new AddDepartmentResDto();
      returnData.data = mockDepartment;
      returnData.message = 'Success';
      returnData.status = 200;
      returnData.version = 'v1';

      jest
        .spyOn(service, 'updateDepartment')
        .mockImplementation(async () => returnData);

      expect(await service.updateDepartment(1, mockDepartment)).toEqual({
        message: 'Success',
        status: 200,
        data: mockDepartment,
        version: 'v1',
      });
    });
  });

  describe('Active department', () => {
    it('should be active department', async () => {
      const mockDepartment: any = {
        id: 1,
        name: 'Department 1',
        address: '15 Mai Thuc Lan',
        openAt: '08:00',
        closeAt: '15:00',
      };

      const returnData: AddDepartmentResDto = new AddDepartmentResDto();
      returnData.data = mockDepartment;
      returnData.message = 'Success';
      returnData.status = 200;
      returnData.version = 'v1';

      jest
        .spyOn(service, 'activeDepartment')
        .mockImplementation(async () => returnData);

      expect(await service.activeDepartment(1)).toEqual({
        message: 'Success',
        status: 200,
        data: mockDepartment,
        version: 'v1',
      });
    });
  });

  describe('Deactive department', () => {
    it('should be deactive department', async () => {
      const mockDepartment: any = {
        id: 1,
        name: 'Department 1',
        address: '15 Mai Thuc Lan',
        openAt: '08:00',
        closeAt: '15:00',
      };

      const returnData: AddDepartmentResDto = new AddDepartmentResDto();
      returnData.data = mockDepartment;
      returnData.message = 'Success';
      returnData.status = 200;
      returnData.version = 'v1';

      jest
        .spyOn(service, 'deActiveDepartment')
        .mockImplementation(async () => returnData);

      expect(await service.deActiveDepartment(1)).toEqual({
        message: 'Success',
        status: 200,
        data: mockDepartment,
        version: 'v1',
      });
    });
  });
});
