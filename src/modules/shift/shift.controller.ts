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
  AddShiftReqDto,
  GetShiftListReqDto,
  UpdateShiftReqDto,
} from './dto/request';
import {
  AddShiftResDto,
  DeleteShiftResDto,
  GetShiftResDto,
  GetShiftListResDto,
  UpdateShiftResDto,
} from './dto/response';
import { ShiftService } from './shift.service';
import { ACCOUNT_ROLE } from '@BE/core/constants';
import { Auth } from '@BE/core/utils/decorators';

@ApiTags('Work shift')
@Controller('shift')
export class ShiftController {
  constructor(private shiftService: ShiftService) {}

  @ApiOperation({ description: 'Create a new work shift' })
  @ApiResponse({
    description: `Create successfully`,
    status: HttpStatus.OK,
    type: AddShiftResDto,
  })
  @Post('create')
  @HttpCode(201)
  async createShift(@Body() shiftDto: AddShiftReqDto): Promise<AddShiftResDto> {
    const response: AddShiftResDto = await this.shiftService.createShift(
      shiftDto,
    );
    return response;
  }

  @Get('list')
  @HttpCode(200)
  @Auth(ACCOUNT_ROLE.ADM, ACCOUNT_ROLE.SUPERVISOR)
  async getShiftList(
    @Query() queries: GetShiftListReqDto,
  ): Promise<GetShiftListResDto> {
    const response: GetShiftListResDto = await this.shiftService.getShiftList(
      queries,
    );
    return response;
  }

  @Get('detail/:id')
  @HttpCode(200)
  @Auth(ACCOUNT_ROLE.ADM, ACCOUNT_ROLE.SUPERVISOR)
  async getShift(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetShiftResDto> {
    const response: GetShiftResDto = await this.shiftService.getShift(id);
    return response;
  }

  @Delete('delete/:id')
  @HttpCode(200)
  async deleteShift(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DeleteShiftResDto> {
    const response: DeleteShiftResDto = await this.shiftService.deleteShift(id);
    return response;
  }

  @Patch('update/:shiftId')
  @HttpCode(200)
  async updateShift(
    @Body() shiftDto: UpdateShiftReqDto,
    @Param('shiftId', ParseIntPipe) shiftId: number,
  ): Promise<UpdateShiftResDto> {
    const response: UpdateShiftResDto = await this.shiftService.updateShift(
      shiftId,
      shiftDto,
    );
    return response;
  }
}
