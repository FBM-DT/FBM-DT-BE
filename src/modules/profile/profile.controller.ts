import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AddProfileReqDto, UpdateProfileReqDto } from './dto/req';
import { AddProfileResDto, UpdateProfileResDto } from './dto/res';
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

  @Patch('update/:id')
  @ApiOkResponse({
    description: 'Update profile',
    schema: {
      example: {
        version: '1.0.0',
        status: 200,
        message: 'OK',
        data: {
          fullname: 'Nguyen Van A',
          dateOfBirth: '2021-01-01',
          gender: 'female',
          address: '15 Mai Thuc Lan',
          email: 'example@gmail.com',
          department: 'Coffeeshop',
          startDate: '2021-01-01',
          endDate: '2021-01-02',
          avatar: 'https://i.pravatar.cc/300',
          phonenumber: '0123456789',
          roleId: 1,
        },
      },
    },
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HasRoles(ACCOUNT_ROLE.SUPERVISOR)
  async updateProfileById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateProfileReqDto,
  ): Promise<UpdateProfileResDto> {
    const res = await this.profileService.updateProfileById(
      id,
      updateProfileDto,
    );
    return res;
  }
}
