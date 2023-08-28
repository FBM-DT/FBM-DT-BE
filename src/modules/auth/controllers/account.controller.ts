import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard, RolesGuard } from '../guards';
import { ACCOUNT_ROLE } from '@BE/core/constants';
import { AccountService } from '../services';
import {
  BadRequestResDto,
  ChangePasswordResDto,
  CreateAccountResDto,
  GetAccountResDto,
  GetAllAccountsResDto,
  NotFoundResDto,
  UpdateAccountResDto,
} from '../dto/response';
import {
  ChangePasswordReqDto,
  CreateAccountReqDto,
  NewPasswordReqDto,
  UpdateAccountReqDto,
} from '../dto/request';
import { GetAccount, HasRoles } from '@BE/core/utils/decorators';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @HasRoles(ACCOUNT_ROLE.ADM, ACCOUNT_ROLE.SUPERVISOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all account' })
  @ApiOkResponse({ description: 'The list account were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Get('list')
  @ApiBearerAuth('token')
  async getAccountList(): Promise<GetAllAccountsResDto> {
    const response: GetAllAccountsResDto =
      await this.accountService.getAccountList();
    return response;
  }

  @UseGuards(JwtAuthGuard)
  @Get('detail')
  @ApiOperation({ summary: 'Get my account detail' })
  @ApiBearerAuth('token')
  async getAccountDetail(@GetAccount() account): Promise<GetAccountResDto> {
    const response: GetAccountResDto = await this.accountService.getAccountById(
      account.payload.accountId,
    );
    return response;
  }

  @ApiOperation({ summary: 'Get account by id' })
  @Get('/:id')
  async getAccount(@Param('id') id: number): Promise<GetAccountResDto> {
    const response: GetAccountResDto = await this.accountService.getAccountById(
      id,
    );
    return response;
  }

  @HasRoles(ACCOUNT_ROLE.ADM)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a new account' })
  @ApiBody({ type: CreateAccountReqDto })
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post()
  @ApiBearerAuth('token')
  async createAccount(
    @Body() accountDto: CreateAccountReqDto,
  ): Promise<CreateAccountResDto> {
    const response: CreateAccountResDto =
      await this.accountService.createAccount(accountDto);
    return response;
  }

  @ApiOperation({ summary: 'Update account by id' })
  @ApiBody({ type: UpdateAccountReqDto })
  @ApiOkResponse({ description: 'The account was updated successfully' })
  @Patch('/:accountId')
  async updateAccountById(
    @Body() accountDto: UpdateAccountReqDto,
    @Param('accountId', ParseIntPipe) accountId: number,
  ): Promise<UpdateAccountResDto> {
    const response: UpdateAccountResDto =
      await this.accountService.updateAccount(accountId, accountDto);
    return response;
  }

  @ApiOperation({ summary: 'Change password' })
  @ApiBody({ type: ChangePasswordReqDto })
  @ApiOkResponse({ description: 'The password was updated successfully' })
  @Patch('/:accountId/change-password')
  async changePassword(
    @Param('accountId', ParseIntPipe) accountId: number,
    @Body() payload: ChangePasswordReqDto,
  ): Promise<ChangePasswordResDto> {
    const response: ChangePasswordResDto =
      await this.accountService.changePassword(accountId, payload);
    return response;
  }

  @ApiOperation({ summary: 'New password' })
  @ApiBody({ type: NewPasswordReqDto })
  @ApiOkResponse({ description: 'The password was updated successfully' })
  @ApiNotFoundResponse({
    description: 'Resource not found',
    type: NotFoundResDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    type: BadRequestResDto,
  })
  @Patch('/:phonenumber/new-password')
  async handleNewPassword(
    @Param('phonenumber') phonenumber: string,
    @Body() payload: NewPasswordReqDto,
  ): Promise<ChangePasswordResDto> {
    const response: ChangePasswordResDto =
      await this.accountService.handleNewPassword(phonenumber, payload);
    return response;
  }
}
