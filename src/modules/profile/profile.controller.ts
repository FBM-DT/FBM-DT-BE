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
import {
  AddProfileResDto,
  GetProfileListResDto,
  UpdateProfileResDto,
} from './dto/res';
import GetProfilesReqDto, { UpdateProfileReqDto } from './dto/req/profile.dto';
import { DEPARTMENT, GENDER } from 'src/core/constants';

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
  async createProfile(
    @Body() createProfileDto: AddProfileReqDto,
  ): Promise<AddProfileResDto> {
    const res = await this.profileService.createProfile(createProfileDto);
    return res;
  }

  @Get('list')
  @ApiQuery({ name: 'page', type: String, example: '1', required: false })
  @ApiQuery({ name: 'pageSize', type: String, required: false, example: '5' })
  @ApiQuery({
    name: 'email',
    type: String,
    required: false,
    example: 'hihi@gmail.com',
  })
  @ApiQuery({ name: 'gender', enum: GENDER, required: false })
  @ApiQuery({
    name: 'fullname',
    type: String,
    required: false,
    example: 'Nguyen Van A',
  })
  @ApiQuery({ name: 'department', enum: DEPARTMENT, required: false })
  @ApiOkResponse({
    description: 'Get profile list',
    schema: {
      example: {
        page: 1,
        pageSize: 5,
        version: '1.0.0',
        status: 200,
        message: 'Success',
        data: [
          {
            id: 1,
            email: 'test123@gmail.com',
            fullname: 'test123',
            address: 'test123',
            gender: 'male',
            department: 'IT',
            createdAt: '2021-09-28T08:41:05.000Z',
            updatedAt: '2021-09-28T08:41:05.000Z',
            startDate: '2021-09-28',
            endDate: '2021-09-28',
          },
        ],
      },
    },
  })
  async findProfiles(
    @Query() queries: GetProfilesReqDto,
  ): Promise<GetProfileListResDto> {
    const res: GetProfileListResDto = await this.profileService.getProfiles(
      queries,
    );
    return res;
  }

  @Patch('update/:id')
  @ApiOkResponse({
    type: UpdateProfileReqDto,
    description: 'Update profile',
  })
  async updateProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProfileDto: UpdateProfileReqDto,
  ): Promise<UpdateProfileResDto> {
    const res: UpdateProfileResDto = await this.profileService.update(
      id,
      updateProfileDto,
    );
    return res;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findProfileById(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }
}
