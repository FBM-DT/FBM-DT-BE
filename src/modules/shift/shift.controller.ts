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
  AddWorkShiftReqDto,
  GetWorkShiftListReqDto,
  UpdateWorkShiftReqDto,
} from './dto/request';
import {
  AddWorkShiftResDto,
  DeleteWorkShiftResDto,
  GetWorkShiftResDto,
  GetWorkShiftListResDto,
  UpdateWorkShiftResDto,
} from './dto/response';
import { ShiftService } from './shift.service';

@ApiTags('Work shift')
@Controller('shift')
export class ShiftController {
  constructor(private shiftService: ShiftService) {}

  @ApiOperation({ description: 'Create a new work shift' })
  @ApiResponse({
    description: `Create successfully`,
    status: HttpStatus.OK,
    type: AddWorkShiftResDto,
  })
  @Post('create')
  @HttpCode(201)
  async createWorkShift(
    @Body() workShiftDto: AddWorkShiftReqDto,
  ): Promise<AddWorkShiftResDto> {
    const response: AddWorkShiftResDto =
      await this.shiftService.createWorkShift(workShiftDto);
    return response;
  }

  @Get('list')
  @HttpCode(200)
  async getWorkShiftList(
    @Query() queries: GetWorkShiftListReqDto,
  ): Promise<GetWorkShiftListResDto> {
    console.log("🚀 ~ file: shift.controller.ts:55 ~ ShiftController ~ queries:", queries)
    const response: GetWorkShiftListResDto =
      await this.shiftService.getWorkShiftList(queries);
    return response;
  }

  @Get('workshift/:id')
  @HttpCode(200)
  async getWorkShift(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetWorkShiftResDto> {
    const response: GetWorkShiftResDto =
      await this.shiftService.getWorkShift(id);
    return response;
  }

  @Delete('delete/:id')
  @HttpCode(200)
  async deleteWorkShift(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteWorkShiftResDto> {
    const response: DeleteWorkShiftResDto =
      await this.shiftService.deleteWorkShift(id);
    return response;
  }

  @Patch('update/:workShiftId')
  @HttpCode(200)
  async updateWorkShift(
    @Body() workShiftDto: UpdateWorkShiftReqDto,
    @Param('workShiftId', ParseIntPipe) workShiftId: number,
  ): Promise<UpdateWorkShiftResDto> {
    const response: UpdateWorkShiftResDto =
      await this.shiftService.updateWorkShift(workShiftId, workShiftDto);
    return response;
  }
}
