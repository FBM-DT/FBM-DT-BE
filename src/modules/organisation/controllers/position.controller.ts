import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { PositionService } from '../services/position.service';
import { CreatePositionReqDto } from '../dto/position/req/position.dto';
import {
  CreatePositionResDto,
  GetPositionResDto,
  GetPositionsResDto,
} from '../dto/position/res/position.dto';
import { Auth } from '../../../core/utils/decorators';
import { ACCOUNT_ROLE } from '../../../core/constants';

@ApiTags('position')
@Controller('position')
export class PositionController {
  constructor(private positionService: PositionService) {}

  @Auth(ACCOUNT_ROLE.ADM, ACCOUNT_ROLE.SUPERVISOR)
  @ApiOperation({ summary: 'Get all position' })
  @Get('list')
  async getPositions(): Promise<GetPositionsResDto> {
    const res: GetPositionsResDto = await this.positionService.getPositions();
    return res;
  }

  @Auth(ACCOUNT_ROLE.ADM, ACCOUNT_ROLE.SUPERVISOR)
  @ApiOperation({ summary: 'Get position by Id' })
  @Get('/:id')
  async getPosition(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetPositionResDto> {
    const res: GetPositionResDto = await this.positionService.getPosition(id);
    return res;
  }

  @Auth(ACCOUNT_ROLE.ADM, ACCOUNT_ROLE.SUPERVISOR)
  @ApiOperation({ summary: 'Create position' })
  @ApiBody({ type: CreatePositionReqDto })
  @Post('create')
  async createPosition(
    @Body() payload: CreatePositionReqDto,
  ): Promise<CreatePositionResDto> {
    const res: CreatePositionResDto = await this.positionService.createPosition(
      payload,
    );
    return res;
  }

  @Auth(ACCOUNT_ROLE.ADM, ACCOUNT_ROLE.SUPERVISOR)
  @ApiOperation({ summary: 'Update position by Id' })
  @ApiBody({ type: CreatePositionReqDto })
  @Patch('update/:id')
  async updatePosition(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: CreatePositionReqDto,
  ): Promise<CreatePositionResDto> {
    const res: CreatePositionResDto = await this.positionService.updatePosition(
      id,
      payload,
    );
    return res;
  }
}
