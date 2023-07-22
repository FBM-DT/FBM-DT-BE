import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiForbiddenResponse,
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
import { ACCOUNT_ROLE } from '../../../core/constants';
import { AccountService } from '../services';
import { HasRoles } from '../decorators/role.decorator';
import {
  CreateAccountResDto,
  GetAccountResDto,
  GetAllAccountsResDto,
  UpdateAccountResDto,
} from '../dto/response';
import { CreateAccountReqDto, UpdateAccountReqDto } from '../dto/request';

@ApiTags('Account')
@Controller('account')
export class AccountController {
  constructor(private accountService: AccountService) {}

  @HasRoles(ACCOUNT_ROLE.ADM)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get all account' })
  @ApiOkResponse({ description: 'The list account were returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @Get('list')
  async getAccountList(): Promise<GetAllAccountsResDto> {
    const response: GetAllAccountsResDto =
      await this.accountService.getAccountList();
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

  @ApiOperation({ summary: 'Create a new account' })
  @ApiBody({ type: CreateAccountReqDto })
  @ApiCreatedResponse({ description: 'Created Successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @Post()
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
}
