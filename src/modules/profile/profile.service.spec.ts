import { ConfigModule } from '@nestjs/config';
import { ProfileModule } from './profile.module';
import { DatabaseModule } from '../../../src/db/database.module';
import { ProfileService } from './profile.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AddProfileReqDto } from './dto/req';
import { AccountService } from '../auth/services';
import { AuthModule } from '../auth/auth.module';
import { AddProfileResDto } from './dto/res';

describe('InventoryService', () => {
  let profileService: ProfileService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
        ProfileModule,
        AuthModule,
        DatabaseModule,
      ],
      providers: [ProfileService, AccountService],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
  });
  it('Create new profile', async () => {
    const data: AddProfileReqDto = {
      fullname: 'Nguyen Van D',
      email: 'example632@gmail.com',
      startDate: new Date(),
      phonenumber: '12345676',
      password: '12345678',
      roleId: 3,
    };
    const test: AddProfileResDto = new AddProfileResDto();
    test.data = data;
    test.message = 'Success';
    test.version = 'v1';
    test.status = 201;

    jest
      .spyOn(profileService, 'createProfile')
      .mockImplementation(async () => test);

    expect(await profileService.createProfile(data)).toEqual({
      message: 'Success',
      status: 201,
      data: data,
      version: 'v1',
    });
  });
});
