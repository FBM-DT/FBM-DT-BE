import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AddWorkShiftRequestDto } from './dto';
import { ShiftService } from './shift.service';

@Controller('shift')
export class ShiftController {
  constructor(private shiftService: ShiftService) {}
  @Post('create')
  @HttpCode(201)
  async createWorkShift(@Body() workShiftDto: AddWorkShiftRequestDto) {
    return this.shiftService.createWorkShift(workShiftDto);
  }
}
