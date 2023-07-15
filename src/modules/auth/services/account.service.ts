import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TYPEORM } from '../../../core/constants';
import { DataSource, Repository } from 'typeorm';
import { AppResponse } from '../../../core/shared/app.response';
import { Account } from '../account.entity';
import {
  CreateAccountResDto,
  GetAccountResDto,
  GetAllAccountsResDto,
  UpdateAccountResDto,
} from '../dto/response';
import { CreateAccountReqDto, UpdateAccountReqDto } from '../dto/request';
import { ErrorMessage } from '../constrants/errorMessages';

@Injectable()
export class AccountService {
  private _accountRepository: Repository<Account>;
  private _dataSource: DataSource;
  constructor(@Inject(TYPEORM) dataSource: DataSource) {
    this._dataSource = dataSource;
    this._accountRepository = dataSource.getRepository(Account);
  }

  async getAccountList(): Promise<GetAllAccountsResDto> {
    const response: GetAllAccountsResDto = new GetAllAccountsResDto();
    try {
      const account = await this._accountRepository.find({
        relations: {
          role: true,
          user: true,
        },
        order: {
          id: 'ASC',
        },
      });

      AppResponse.setSuccessResponse<GetAllAccountsResDto>(response, account);
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse<GetAllAccountsResDto>(
        response,
        error.message,
      );
      return response;
    }
  }

  async getAccountById(id: number): Promise<GetAccountResDto> {
    const response: GetAccountResDto = new GetAccountResDto();
    try {
      const account = await this._accountRepository.findOne({
        where: { id },
        relations: ['user', 'role'],
      });
      if (!account) {
        AppResponse.setUserErrorResponse<GetAccountResDto>(
          response,
          ErrorMessage.ACCOUNT_NOT_FOUND,
        );
        return response;
      }

      AppResponse.setSuccessResponse<GetAccountResDto>(response, account);
      return response;
    } catch (error) {
      AppResponse.setAppErrorResponse<GetAccountResDto>(
        response,
        error.message,
      );
      return response;
    }
  }

  async getAccountByPhoneNumber(phoneNumber: string): Promise<Account> {
    try {
      const response = await this._accountRepository.findOne({
        where: { phonenumber: phoneNumber },
        relations: ['user', 'role'],
      });
      return response;
    } catch (error) {
      if (error.status !== 500) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async createAccount(
    payload: CreateAccountReqDto,
  ): Promise<CreateAccountResDto> {
    const response: CreateAccountResDto = new CreateAccountResDto();
    try {
      const { phonenumber, password } = payload;

      const existPhoneNumber = await this._accountRepository.findOne({
        where: { phonenumber },
      });

      if (phonenumber === existPhoneNumber?.phonenumber) {
        throw new Error(ErrorMessage.THE_PHONE_NUMBER_ALREADY_EXISTS);
      } else {
        const hashPassword = this.handleHashPassword(password);
        const data = { ...payload, password: hashPassword };

        const account = await this._accountRepository
          .createQueryBuilder()
          .insert()
          .into(Account)
          .values(data)
          .execute();

        AppResponse.setSuccessResponse<CreateAccountResDto>(
          response,
          account.identifiers[0].id,
          {
            status: 201,
            message: 'Created',
          },
        );
        return response;
      }
    } catch (error) {
      AppResponse.setAppErrorResponse<CreateAccountResDto>(
        response,
        error.message,
      );
      return response;
    }
  }

  async updateAccount(
    accountId: number,
    accountDto: UpdateAccountReqDto,
  ): Promise<UpdateAccountResDto> {
    const response: UpdateAccountResDto = new UpdateAccountResDto();
    try {
      let newPassword: string;
      const { phonenumber, password } = accountDto;
      const existPhoneNumber = await this._accountRepository.findOne({
        where: { phonenumber },
      });

      if (phonenumber === existPhoneNumber?.phonenumber) {
        AppResponse.setUserErrorResponse<UpdateAccountResDto>(
          response,
          ErrorMessage.THE_PHONE_NUMBER_ALREADY_EXISTS,
        );
        return response;
      }

      if (!password) {
        const result = await this._accountRepository
          .createQueryBuilder('account')
          .update(Account)
          .where('account.id = :accountId', { accountId: accountId })
          .set(accountDto)
          .execute();
        AppResponse.setSuccessResponse<UpdateAccountResDto>(
          response,
          result.affected,
        );
        return response;
      } else {
        newPassword = this.handleHashPassword(password);
        const account = { ...accountDto, password: newPassword };
        const result = await this._accountRepository
          .createQueryBuilder('account')
          .update(Account)
          .where('account.id = :accountId', { accountId: accountId })
          .set(account)
          .execute();
        AppResponse.setSuccessResponse<UpdateAccountResDto>(
          response,
          result.affected,
        );
        return response;
      }
    } catch (error) {
      AppResponse.setAppErrorResponse<UpdateAccountResDto>(
        response,
        error.message,
      );
      return response;
    }
  }

  async updateRefreshToken(
    id: number,
    payload: UpdateAccountReqDto,
  ): Promise<Account> {
    try {
      const account = await this._accountRepository.findOneBy({ id });
      account.refreshToken = payload.refreshToken;
      return await this._accountRepository.save(account);
    } catch (error) {
      throw error;
    }
  }

  private handleHashPassword(password: string) {
    const saltOrRounds = 10;
    const hashPassword = bcrypt.hashSync(password, saltOrRounds);
    return hashPassword;
  }
}
