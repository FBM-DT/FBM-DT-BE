import {
  Controller,
  Post,
  Body,
  ParseIntPipe,
  Patch,
  Param,
  Query,
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
  UpdateProfileReqDto,
  GetProfilesReqDto,
  GetProfileReqDto,
} from './dto/req';
import {
  AddProfileResDto,
  UpdateProfileResDto,
  GetProfileResDto,
  GetProfilesResDto,
} from './dto/res';
import { ACCOUNT_ROLE } from '../../core/constants';
import { Auth, GetAccount } from '../../core/utils/decorators';

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
  async findAccountProfile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetProfileResDto> {
    const res = await this.profileService.getAccountProfile(id);
    return res;
  }

  @ApiOkResponse({ type: GetProfileReqDto })
  @Get('findUser/:id')
  async findUserProfile(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<GetProfileResDto> {
    const res = await this.profileService.getUserProfile(id);
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
  // @Auth()
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @GetAccount() account,
    @Body() updateProfileDto: UpdateProfileReqDto,
  ): Promise<UpdateProfileResDto> {
    const res = await this.profileService.updateProfile(
      id,
      account,
      updateProfileDto,
    );
    return res;
  }

  @Patch(':id/deactivate')
  @Auth(ACCOUNT_ROLE.ADM, ACCOUNT_ROLE.SUPERVISOR)
  async deactivateUser(@Param('id') id: number) {
    const res = await this.profileService.deActivateProfile(id);
    return res;
  }

  @Patch(':id/activate')
  @Auth(ACCOUNT_ROLE.ADM, ACCOUNT_ROLE.SUPERVISOR)
  async activateUser(@Param('id') id: number) {
    const res = await this.profileService.activateProfile(id);
    return res;
  }
  @Get('list')
  async getProfiles(
    @Query() queries: GetProfilesReqDto,
  ): Promise<GetProfilesResDto> {
    const response: GetProfilesResDto = await this.profileService.getProfiles(
      queries,
    );
    return response;
  }
}
