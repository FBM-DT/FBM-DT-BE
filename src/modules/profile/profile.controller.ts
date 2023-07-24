import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AddProfileReqDto } from './dto/req';
import { AddProfileResDto } from './dto/res';
import { ACCOUNT_ROLE } from '../../core/constants';
import { HasRoles } from '../auth/decorators/role.decorator';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create')
  @ApiCreatedResponse({
    description: 'Create profile',
    schema: {
      example: {
        version: '1.0.0',
        status: 201,
        message: 'Created',
        data: 1,
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(ACCOUNT_ROLE.SUPERVISOR)
  async createProfile(
    @Body() createProfileDto: AddProfileReqDto,
  ): Promise<AddProfileResDto> {
    const res = await this.profileService.createProfile(createProfileDto);
    return res;
  }
}
