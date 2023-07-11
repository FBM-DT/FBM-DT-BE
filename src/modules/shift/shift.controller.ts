import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
  Delete,
  ParseIntPipe,
  Post,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import {
  AddWorkShiftRequestDto,
  AddWorkShiftResponseDto,
  DeleteWorkShiftByIdResponseDto,
  GetWorkShiftByIdResponseDto,
  GetWorkShiftListByQueriesRequestDto,
  GetWorkShiftListByQueriesResponseDto,
  GetWorkShiftListResponseDto,
  UpdateWorkShiftRequestDto,
  UpdateWorkShiftResponseDto,
} from './dto';
import { ShiftService } from './shift.service';

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
    const response: AddWorkShiftResponseDto =
      await this.shiftService.createWorkShift(workShiftDto);
    return response;
  }

  @Get('list')
  @HttpCode(200)
  async getWorkShiftList(): Promise<GetWorkShiftListResponseDto> {
    const response: GetWorkShiftListResponseDto =
      await this.shiftService.getWorkShiftList();
    return response;
  }

  @Get('filteredList')
  @HttpCode(200)
  async getWorkShiftFilteredList(
    @Query() queries: GetWorkShiftListByQueriesRequestDto,
  ): Promise<GetWorkShiftListByQueriesResponseDto> {
    const response: GetWorkShiftListByQueriesResponseDto =
      await this.shiftService.getWorkShiftFilteredList(queries);
    return response;
  }

  @Get('workshift/:id')
  @HttpCode(200)
  async getAWorkShiftById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetWorkShiftByIdResponseDto> {
    const response: GetWorkShiftByIdResponseDto =
      await this.shiftService.getAWorkShiftById(id);
    return response;
  }

  @Delete('delete/:id')
  @HttpCode(200)
  async deleteWorkShift(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteWorkShiftByIdResponseDto> {
    const response: DeleteWorkShiftByIdResponseDto =
      await this.shiftService.deleteWorkShiftById(id);
    return response;
  }

  @Patch('update/:workShiftId')
  @HttpCode(200)
  async updateWorkShift(
    @Body() workShiftDto: UpdateWorkShiftRequestDto,
    @Param('workShiftId', ParseIntPipe) workShiftId: number,
  ): Promise<UpdateWorkShiftResponseDto> {
    const response: UpdateWorkShiftResponseDto =
      await this.shiftService.updateWorkShift(workShiftId, workShiftDto);
    return response;
  }
}
