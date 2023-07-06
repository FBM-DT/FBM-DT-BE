import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard, RolesGuard } from '../guards';
import { ACCOUNT_ROLE } from '../../../core/constants';
import { AccountService } from '../services';
import {
  CreateAccountResponseDto,
  CreateAccountRequestDto,
  GetAccountByIdResponseDto,
  UpdateAccountResponseDto,
  UpdateAccountByIdRequestDto,
} from '../dto';
import { HttpExceptionFilter } from '../../../core/shared/exception.filter';
import { HasRoles } from '../decorators/role.decorator';

@UseFilters(new HttpExceptionFilter())
@ApiTags('Account')
@ApiBearerAuth()
@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }

  @ApiOperation({ summary: 'Get data by admin role' })
  @ApiBearerAuth('token')
  @HasRoles(ACCOUNT_ROLE.ADM)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin')
  async onlyAdmin(@Req() req: Request) {
    return req.user;
  }

  @ApiBearerAuth('token')
  @HasRoles(ACCOUNT_ROLE.ADM)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all account' })
  @ApiOkResponse({ description: 'The list account were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Get()
  getAccountList() {
    return this.accountService.getAccountList();
  }

  @ApiOperation({ summary: 'Get account by id' })
  @Get('/:id')
  async getAccountByPhoneNumber(
    @Param('id') id: number,
  ): Promise<GetAccountByIdResponseDto> {
    const response: GetAccountByIdResponseDto = new GetAccountByIdResponseDto();

    const data = await this.accountService.getAccountById(id);
    response.status = 200;
    response.message = 'Success';
    response.data = data;
    response.page = 1;
    response.pageSize = 1;
    response.searchBy = { id };
    return response;
  }

  @ApiOperation({ summary: 'Create a new account' })
  @ApiBody({ type: CreateAccountRequestDto })
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post()
  async createAccount(
    @Body() accountDto: CreateAccountRequestDto,
  ): Promise<CreateAccountResponseDto> {
    const response: CreateAccountResponseDto =
      await this.accountService.createAccount(accountDto);
    return response;
  }

  @ApiOperation({ summary: 'Update account by id' })
  @ApiBody({ type: UpdateAccountByIdRequestDto })
  @ApiOkResponse({ description: 'The account was updated successfully' })
  @Patch('/:accountId')
  async updateAccountById(
    @Body() accountDto: UpdateAccountByIdRequestDto,
    @Param('accountId', ParseIntPipe) accountId: number,
  ): Promise<UpdateAccountResponseDto> {
    const response: UpdateAccountResponseDto =
      await this.accountService.updateAccount(accountId, accountDto);
    return response;
  }
}
