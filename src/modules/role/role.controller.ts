import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
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
