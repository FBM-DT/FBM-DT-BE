import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AddDepartmentResDto,
  GetDepartmentListResDto,
  UpdateDepartmentResDto,
} from '../dto/department/res';
import { DepartmentService } from '../services/department.service';
import {
  AddDepartmentReqDto,
  UpdateDepartmentReqDto,
} from '../dto/department/req';

@ApiTags('Department')
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get('list')
  @ApiOkResponse({ type: AddDepartmentReqDto })
  @HttpCode(200)
  async findAllDepartment(): Promise<GetDepartmentListResDto> {
    const response: GetDepartmentListResDto =
      await this.departmentService.getAllDepartment();
    return response;
  }

  @Post('create')
  @ApiOperation({ description: 'Create a new Inventory' })
  @HttpCode(201)
  async createDepartment(
    @Body() DepartmentDto: AddDepartmentReqDto,
  ): Promise<AddDepartmentResDto> {
    const response: AddDepartmentResDto =
      await this.departmentService.createDepartment(DepartmentDto);
    return response;
  }

  @Patch('update/:id')
  async updateDepartment(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: UpdateDepartmentReqDto,
  ): Promise<UpdateDepartmentResDto> {
    const res = await this.departmentService.updateDepartment(
      id,
      updateDepartmentDto,
    );
    return res;
  }

  @Patch('activate/:id')
  async activateDepartment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UpdateDepartmentResDto> {
    const res = await this.departmentService.activeDepartment(id);
    return res;
  }

  @Patch('deactivate/:id')
  async deactivateDepartment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UpdateDepartmentResDto> {
    const res = await this.departmentService.deActiveDepartment(id);
    return res;
  }
}
