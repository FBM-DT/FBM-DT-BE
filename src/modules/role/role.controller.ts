import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { RoleService } from './role.service';
import { GetRolesResDto } from './dto/response/role.dto';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiOperation({ summary: 'Get all role' })
  @ApiOkResponse({ description: 'The list role were returned successfully' })
  @Get('list')
  async getAll(): Promise<GetRolesResDto> {
    const res: GetRolesResDto = await this.roleService.getAll();
    return res;
  }
}
