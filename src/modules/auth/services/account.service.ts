import {
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CONNECTION } from '../../../core/constants';
import { DataSource, Repository } from 'typeorm';
import { AppResponse } from '../../../core/shared/app.response';
import { Account } from '../account.entity';
import {
  CreateAccountResponseDto,
  CreateAccountRequestDto,
  UpdateAccountRequestDto,
  GetAccountByIdResponseDto,
  UpdateAccountResponseDto,
  UpdateAccountByIdRequestDto,
} from '../dto';
import { CustomHttpException } from '../../../core/shared/custom.http.exception';

@Injectable()
export class AccountService {
  private _accountRepository: Repository<Account>;
  constructor(@Inject(CONNECTION) private dataSource: DataSource) {
    this._accountRepository = this.dataSource.getRepository(Account);
  }

  async getAccountList(): Promise<Account[]> {
    try {
      const account = await this._accountRepository
        .createQueryBuilder('account')
        .leftJoinAndSelect('account.role', 'role')
        .leftJoinAndSelect('account.user', 'user')
        .orderBy('account.id', 'ASC')
        .getMany();
      return account;
    } catch (error) {
      if (error.status !== 500) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async getAccountById(id: number): Promise<GetAccountByIdResponseDto> {
    const response: GetAccountByIdResponseDto = new GetAccountByIdResponseDto();
    try {
      const account = await this._accountRepository.findOne({
        where: { id },
        relations: ['user', 'role'],
      });
      if (!account) throw new NotFoundException(`Account ${id} not found`);

      AppResponse.setSuccessResponse<GetAccountByIdResponseDto>(
        response,
        (response.data = account),
      );
      return response;
    } catch (error) {
      console.log(error.message);
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
    payload: CreateAccountRequestDto,
  ): Promise<CreateAccountResponseDto> {
    const response: CreateAccountResponseDto = new CreateAccountResponseDto();
    try {
      const { phonenumber, password } = payload;

      const existPhoneNumber = await this._accountRepository.findOne({
        where: { phonenumber },
      });

      if (phonenumber === existPhoneNumber?.phonenumber) {
        throw new CustomHttpException(
          'The Phone number already exists',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        const hashPassword = this.handleHashPassword(password);
        const data = { ...payload, password: hashPassword };

        const account = await this._accountRepository
          .createQueryBuilder()
          .insert()
          .into(Account)
          .values(data)
          .execute();

        AppResponse.setSuccessResponse<CreateAccountResponseDto>(
          response,
          account.identifiers[0].id,
        );
        return response;
      }
    } catch (error) {
      AppResponse.setAppErrorResponse<CreateAccountResponseDto>(
        response,
        error.message,
      );
      if (response.status === 500) {
        throw new CustomHttpException(
          response.exception,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return response;
    }
  }

  async updateAccount(
    accountId: number,
    accountDto: UpdateAccountByIdRequestDto,
  ): Promise<UpdateAccountResponseDto> {
    const response: UpdateAccountResponseDto = new UpdateAccountResponseDto();
    try {
      let newPassword: string;
      const { phonenumber, password } = accountDto;
      const existPhoneNumber = await this._accountRepository.findOne({
        where: { phonenumber },
      });

      if (phonenumber === existPhoneNumber?.phonenumber) {
        AppResponse.setUserErrorResponse<CreateAccountResponseDto>(
          response,
          'The Phone number already exists',
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
        AppResponse.setSuccessResponse<UpdateAccountResponseDto>(
          response,
          result.affected,
        );
        return response;
      } else {
        newPassword = this.handleHashPassword(password);
        console.log(newPassword);
        const account = { ...accountDto, password: newPassword };
        const result = await this._accountRepository
          .createQueryBuilder('account')
          .update(Account)
          .where('account.id = :accountId', { accountId: accountId })
          .set(account)
          .execute();
        AppResponse.setSuccessResponse<UpdateAccountResponseDto>(
          response,
          result.affected,
        );
        return response;
      }
    } catch (error) {
      if (error.status !== 500) {
        console.log(error.message);
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async updateRefreshTokenAccount(
    id: number,
    payload: UpdateAccountRequestDto,
  ): Promise<Account> {
    try {
      const account = await this._accountRepository.findOneBy({ id });
      account.refreshToken = payload.refreshToken;
      return await this._accountRepository.save(account);
    } catch (error) {
      if (error.status !== 500) {
        console.log(error.message);
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  private handleHashPassword(password: string) {
    const saltOrRounds = 10;
    const hashPassword = bcrypt.hashSync(password, saltOrRounds);
    return hashPassword;
  }
}
