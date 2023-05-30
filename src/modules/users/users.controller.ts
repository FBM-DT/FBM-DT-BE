import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('add')
  async addUser(@Body() dto: UserDto) {
    console.log("🚀 ~ file: users.controller.ts:11 ~ UsersController ~ addUser ~ dto:", dto)
    return this.userService.addUser(dto);
  }
}
