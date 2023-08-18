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
import { Auth } from 'src/core/utils/decorators';
import { ListDepartmentResDto } from '../dto/department/res/swagger.dto';
import { ACCOUNT_ROLE } from 'src/core/constants';

@ApiTags('Department')
@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get('list')
  @Auth()
  @ApiOkResponse({ type: ListDepartmentResDto })
  @HttpCode(200)
  async findAllDepartment(): Promise<GetDepartmentListResDto> {
    const response: GetDepartmentListResDto =
      await this.departmentService.getAllDepartment();
    return response;
  }

  @Post('create')
  @Auth(ACCOUNT_ROLE.SUPERVISOR, ACCOUNT_ROLE.ADM)
  @ApiOperation({ description: 'Create a new Department' })
  @HttpCode(201)
  async createDepartment(
    @Body() DepartmentDto: AddDepartmentReqDto,
  ): Promise<AddDepartmentResDto> {
    const response: AddDepartmentResDto =
      await this.departmentService.createDepartment(DepartmentDto);
    return response;
  }

  @Patch('update/:id')
  @Auth(ACCOUNT_ROLE.SUPERVISOR, ACCOUNT_ROLE.ADM)
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
  @Auth(ACCOUNT_ROLE.SUPERVISOR, ACCOUNT_ROLE.ADM)
  async activateDepartment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UpdateDepartmentResDto> {
    const res = await this.departmentService.activeDepartment(id);
    return res;
  }

  @Patch('deActivate/:id')
  @Auth(ACCOUNT_ROLE.SUPERVISOR, ACCOUNT_ROLE.ADM)
  async deactivateDepartment(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UpdateDepartmentResDto> {
    const res = await this.departmentService.deActiveDepartment(id);
    return res;
  }
}
