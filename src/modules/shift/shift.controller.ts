import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
  ParseIntPipe,
  Post,
  HttpStatus,
} from '@nestjs/common';
import {
  AddWorkShiftRequestDto,
  AddWorkShiftResponseDto,
  GetWorkShiftByIdResponseDto,
  GetWorkShiftListByQueriesRequestDto,
  GetWorkShiftListByQueriesResponseDto,
  GetWorkShiftListResponseDto,
} from './dto';
import { ShiftService } from './shift.service';
import { WorkShift } from './entities/work-shift.entity';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { WORKTYPE } from '../../core/constants';

@ApiTags('Work shift')
@Controller('shift')
export class ShiftController {
  constructor(private shiftService: ShiftService) {}

  @ApiOperation({ description: 'Create a new work shift' })
  @ApiResponse({
    description: `Create successfully`,
    status: HttpStatus.OK,
    type: AddWorkShiftResponseDto,
  })
  @Post('create')
  @HttpCode(201)
  async createWorkShift(
    @Body() workShiftDto: AddWorkShiftRequestDto,
  ): Promise<AddWorkShiftResponseDto> {
    const response: AddWorkShiftResponseDto = await this.shiftService.createWorkShift(workShiftDto);
    return response;
  }

  @Get('list')
  @HttpCode(200)
  async getWorkShiftList(): Promise<GetWorkShiftListResponseDto> {
    const response: GetWorkShiftListResponseDto =
      new GetWorkShiftListResponseDto();
    const data: WorkShift[] = await this.shiftService.getWorkShiftList();
    response.status = 200;
    response.message = 'Success';
    response.data = data;
    response.pageSize = data.length;
    response.page = 1;
    response.sortBy = 'asc';
    return response;
  }

  @Get('filteredList')
  @HttpCode(200)
  async getWorkShiftFilteredList(
    @Query() queries: GetWorkShiftListByQueriesRequestDto,
  ): Promise<GetWorkShiftListByQueriesResponseDto> {
    let options: FindManyOptions;
    let whereConditions: FindOptionsWhere<WorkShift>;

    const response: GetWorkShiftListByQueriesResponseDto =
      new GetWorkShiftListByQueriesResponseDto();

    if (queries.page && queries.pageSize) {
      options = {
        ...options,
        skip: (queries.page - 1) * queries.pageSize,
        take: queries.pageSize,
      };
      response.page = queries.page;
      response.pageSize = queries.pageSize;
    }

    if (queries.sortBy && queries.sortValue) {
      options = { ...options, order: { [queries.sortBy]: queries.sortValue } };
      response.sortBy = queries.sortBy;
      response.sortValue = queries.sortValue;
    }

    if (queries.address) {
      whereConditions = { ...whereConditions, address: queries.address };
    }

    if (queries.type) {
      whereConditions = {
        ...whereConditions,
        type: WORKTYPE[queries.type.toUpperCase()],
      };
    }

    if (whereConditions) {
      options = { ...options, where: whereConditions };
      response.searchBy = whereConditions;
    }

    const data: WorkShift[] = await this.shiftService.getWorkShiftFilteredList(
      options,
    );
    response.status = 200;
    response.message = 'Success';
    response.data = data;
    return response;
  }
  @Get('workshift/:id')
  @HttpCode(200)
  async getAWorkShiftById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetWorkShiftByIdResponseDto> {
    const response: GetWorkShiftByIdResponseDto =
      new GetWorkShiftByIdResponseDto();
    const data: WorkShift = await this.shiftService.getAWorkShiftById(id);
    response.status = 200;
    response.message = 'Success';
    response.data = data;
    response.page = 1;
    response.pageSize = 1;
    response.searchBy = { id: id };
    return response;
  }
}
