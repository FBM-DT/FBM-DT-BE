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
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  AddProfileReqDto,
  GetProfileReqDto,
  UpdateProfileReqDto,
} from './dto/req';
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
    type: AddProfileReqDto,
  })
  @Auth(ACCOUNT_ROLE.SUPERVISOR)
  async createProfile(
    @Body() createProfileDto: AddProfileReqDto,
  ): Promise<AddProfileResDto> {
    const res = await this.profileService.createProfile(createProfileDto);
    return res;
  }

  @ApiOkResponse({ type: GetProfileReqDto })
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
      allOf: [
        { $ref: getSchemaPath(UpdateProfileReqDto) },
        {
          properties: {
            userId: {
              type: 'number',
              example: '1',
            },
            accountId: {
              type: 'number',
              example: '1',
            },
          },
        },
      ],
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
