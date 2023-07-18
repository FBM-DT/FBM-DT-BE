import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AddProfileReqDto } from './dto/req';
import { AddProfileResDto } from './dto/res';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('create')
  @ApiCreatedResponse({ description: 'Create profile', type: AddProfileReqDto })
  async createProfile(
    @Body() createProfileDto: AddProfileReqDto,
  ): Promise<AddProfileResDto> {
    const res = await this.profileService.createProfile(createProfileDto);
    return res;
  }

  @Get()
  findAll() {
    return this.profileService.getAllProfile();
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
