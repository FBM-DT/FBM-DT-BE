import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AddProfileReqDto } from './dto/req';
import { AddProfileResDto, GetProfileResDto } from './dto/res';
import { ACCOUNT_ROLE } from '../../core/constants';
import { HasRoles } from '../../core/utils/decorators';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Auth } from '../../core/utils/decorators/Auth';

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

  @ApiOkResponse({
    description: 'Get profile by id',
    schema: {
      example: {
        version: '1.0.0',
        status: 200,
        message: 'OK',
        data: {
          id: 1,
          fullname: 'Nguyen Van A',
          email: 'example62@gmail.com',
          dateOfBirth: '2021-01-01',
          avatar: 'https://i.pravatar.cc/300',
          startDate: '2021-01-01',
          endDate: '2021-01-02',
          department: 'Coffeeshop',
          gender: 'female',
        },
      },
    },
  })
  @Get('findOne/:id')
  async findProfile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetProfileResDto> {
    const res = await this.profileService.getProfile(id);
    return res;
  }
}
