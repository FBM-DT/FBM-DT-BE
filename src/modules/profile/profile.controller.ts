import {
  Controller,
  Post,
  Body,
  ParseIntPipe,
  Patch,
  Param,
  Get,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AddProfileReqDto, UpdateProfileReqDto } from './dto/req';
import {
  AddProfileResDto,
  UpdateProfileResDto,
  GetProfileResDto,
} from './dto/res';
import { ACCOUNT_ROLE } from '../../core/constants';
import { Auth } from '../../core/utils/decorators';

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
  @Auth(ACCOUNT_ROLE.SUPERVISOR)
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
  @Patch('update/:id')
  @Auth(ACCOUNT_ROLE.SUPERVISOR)
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateProfileReqDto,
  ): Promise<UpdateProfileResDto> {
    const res = await this.profileService.updateProfile(id, updateProfileDto);
    return res;
  }

  @Patch(':id/deactivate')
  @Auth(ACCOUNT_ROLE.ADM, ACCOUNT_ROLE.SUPERVISOR)
  async deactivateUser(@Param('id') id: number) {
    const res = await this.profileService.deActiveProfile(id);
    return res;
  }

  @Patch(':id/active')
  @Auth(ACCOUNT_ROLE.ADM, ACCOUNT_ROLE.SUPERVISOR)
  async activateUser(@Param('id') id: number) {
    const res = await this.profileService.activeProfile(id);
    return res;
  }
}
