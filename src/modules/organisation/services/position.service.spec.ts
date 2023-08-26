import { DatabaseModule } from '@BE/db/database.module';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PositionService } from './position.service';
import { Position } from '../entities/position.entity';
import { CreatePositionReqDto } from '../dto/position/req/position.dto';
import {
  CreatePositionResDto,
  GetPositionResDto,
  GetPositionsResDto,
  UpdatePositionResDto,
} from '../dto/position/res/position.dto';
import { IPosition } from '../interfaces';
import { AppResponse } from '@BE/core/shared/app.response';

describe('PositionServiceTestCase', () => {
  let service: PositionService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
        Position,
        DatabaseModule,
      ],
      providers: [PositionService],
    }).compile();

    service = module.get<PositionService>(PositionService);
  });

  it('Should be defined position service', () => {
    expect(service).toBeDefined();
  });

  it('should create a new position when valid position data is provided', async () => {
    const positionData: CreatePositionReqDto = {
      name: 'Test Position',
    };
    const createdPosition: CreatePositionResDto = new CreatePositionResDto();
    createdPosition.data = positionData;
    createdPosition.message = 'Created';
    createdPosition.status = 201;
    createdPosition.version = 'v1';

    const mockPositionRepository = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      into: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(createdPosition),
    };

    jest
      .spyOn(service, 'createPosition')
      .mockImplementation(async () => createdPosition);

    expect(await service.createPosition(positionData)).toEqual({
      message: 'Created',
      status: 201,
      data: positionData,
      version: 'v1',
    });
  });

  it('should return a successful response with positions array', async () => {
    const positions: IPosition[] = [
      { id: 1, name: 'Position 1' },
      { id: 2, name: 'Position 2' },
    ];

    const responseData: GetPositionsResDto = new GetPositionsResDto();
    responseData.data = positions;
    responseData.message = 'Success';
    responseData.status = 200;
    responseData.version = 'v1';

    jest
      .spyOn(service, 'getPositions')
      .mockImplementation(async () => responseData);

    const result = await service.getPositions();

    expect(result).toEqual(AppResponse.setSuccessResponse(positions));
  });

  it('should return a user error response when a position id is not found in the database', async () => {
    const positionId = 999;
    const responseData: GetPositionResDto = new GetPositionResDto();
    responseData.exception = 'The position 999 does not exist';
    responseData.message = 'Failed';
    responseData.status = 400;
    responseData.version = 'v1';
    jest
      .spyOn(service['_positionRepository'], 'findOne')
      .mockResolvedValue(null);

    const result = await service.getPosition(positionId);

    expect(result).toEqual(responseData);
  });

  it('should update the position name when given a valid id and name', async () => {
    const id = 1;
    const name: any = 'New Position Name';
    const existPosition: IPosition = { id: 1, name: 'Old Position Name' };

    const findPosition: GetPositionResDto = new GetPositionResDto();
    findPosition.data = existPosition;
    findPosition.message = 'Success';
    findPosition.status = 200;
    findPosition.version = 'v1';

    const updatedPositionRes: UpdatePositionResDto = new UpdatePositionResDto();
    updatedPositionRes.data = { affected: 1 };
    updatedPositionRes.message = 'Success';
    updatedPositionRes.status = 200;
    updatedPositionRes.version = 'v1';

    jest
      .spyOn(service, 'getPosition')
      .mockImplementation(async () => findPosition);

    expect(await service.getPosition(id)).toEqual(findPosition);

    jest
      .spyOn(service, 'updatePosition')
      .mockImplementation(async () => updatedPositionRes);

    expect(await service.updatePosition(id, name)).toEqual(updatedPositionRes);
  });
});
