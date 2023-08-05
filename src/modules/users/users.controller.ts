import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { AddUserProfileReqDto } from './dto/request';
import { AddUserProfileResDto } from './dto/response';
import { HasRoles } from '../auth/decorators/role.decorator';
import { ACCOUNT_ROLE } from 'src/core/constants';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('addProfile')
  async addProfileUser(
    @Body() dto: AddUserProfileReqDto,
  ): Promise<AddUserProfileResDto> {
    const response: AddUserProfileResDto =
      await this.userService.addProfileUser(dto);
    return response;
  }

  @Patch('staffUpdateProfile')
  async updateProfile() {
    
  }
}
