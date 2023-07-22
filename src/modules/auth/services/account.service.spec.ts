import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { DatabaseModule } from '../../../../src/db/database.module';
import { AuthModule } from '../auth.module';
import { AccountService } from './account.service';
import { CreateAccountReqDto } from '../dto/request';
import { CreateAccountResDto } from '../dto/response';

describe('AccountService', () => {
  let accountService: AccountService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AuthModule,
        DatabaseModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.sample' }),
      ],
      providers: [AccountService],
    }).compile();

    accountService = module.get<AccountService>(AccountService);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('Create new account', () => {
    it('AccountService should be defined', () => {
      expect(accountService).toBeDefined();
    });

    it('Should be created successfully', async () => {
      const response: CreateAccountResDto = new CreateAccountResDto();
      response.data = 1;
      response.message = 'Success';
      response.version = 'v1';
      response.status = 201;
      const accountRequestDto: CreateAccountReqDto = {
        phonenumber: '0979889446',
        password: 'password',
        userId: 1,
        roleId: 1,
        refreshToken: null,
      };
      jest
        .spyOn(accountService, 'createAccount')
        .mockImplementation(async () => response);
      expect(accountRequestDto.phonenumber).toBeDefined();
      expect(accountRequestDto.password).toBeDefined();
      expect(accountRequestDto.userId).toBeDefined();
      expect(accountRequestDto.roleId).toBeDefined();
      expect(await accountService.createAccount(accountRequestDto)).toEqual({
        message: 'Success',
        status: 201,
        data: 1,
        version: 'v1',
      });
    });

    it('Should be get account by id successfully', async () => {
      const id = 1;
      const expectedResponse = {
        id: 16,
        phonenumber: '0977686899',
        password:
          '$2b$10$mzn9OnZ6lVD069JR42QKcuo1.jY2TX4tRoFUcGErLTUUeulaoLY6.',
        roleId: 1,
        userId: 3,
        refreshToken: null,
        role: {
          id: 1,
          name: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        user: {
          id: 3,
          fullname: 'Pham Trung Nam',
          email: 'nampt@gmail.com',
          createdAt: new Date(),
          updatedAt: new Date(),
          avatar:
            'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        message: 'Success',
        status: 200,
        version: 'v1',
      };
      jest
        .spyOn(accountService, 'getAccountById')
        .mockResolvedValue(expectedResponse);

      expect(id).toBeDefined();
      const result = await accountService.getAccountById(id);
      expect(result).toEqual(expectedResponse);
    });
  });
});
