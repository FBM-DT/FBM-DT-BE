import { Injectable, Inject } from '@nestjs/common';
import { User } from '../users/user.entity';
import { DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { TYPEORM } from '../../core/constants';
import {
  AddProfileReqDto,
  UpdateProfileReqDto,
  GetProfilesReqDto,
} from './dto/req';
import {
  AddProfileResDto,
  GetProfileResDto,
  GetProfilesResDto,
  UpdateProfileResDto,
} from './dto/res';
import { AppResponse } from '@BE/core/shared/app.response';
import { ErrorHandler } from '@BE/core/shared/common/error';
import { IAccountData, IExistDataReturnValue, IProfile } from './interfaces';
import { Bcrypt } from '@BE/core/utils';
import { IAccountPayload, IUserPayload } from './interfaces';
import { Department } from '@BE/modules/organisation/entities/department.entity';
import { Position } from '@BE/modules/organisation/entities/position.entity';
import { isProfileUpdateAllowedForUserRole } from '@BE/core/utils/checkUser';
import { Account } from '@BE/modules/auth/account.entity';
import { ExtraQueryBuilder } from '@BE/core/utils/querybuilder.typeorm';

@Injectable()
export class ProfileService {
  private _userRepository: Repository<User>;
  private _dataSource: DataSource;
  constructor(
    @Inject(TYPEORM)
    dataSource: DataSource,
  ) {
    this._dataSource = dataSource;
    this._userRepository = dataSource.getRepository(User);
  }

  async createProfile(data: AddProfileReqDto): Promise<AddProfileResDto> {
    const { phonenumber, password, roleId, ...rest } = data;

    const userData: IUserPayload = {
      ...rest,
    };

    const account: IAccountPayload = {
      phonenumber,
      password,
      roleId,
    };

    try {
      const isExistPhoneNumber: IExistDataReturnValue =
        await this.isExistUserProfileData({
          phonenumber: data.phonenumber,
        });
      if (isExistPhoneNumber.isExist) {
        return AppResponse.setUserErrorResponse<AddProfileResDto>(
          isExistPhoneNumber.message,
        );
      }
      const isExistEmail: IExistDataReturnValue =
        await this.isExistUserProfileData({
          email: data.email,
        });

      if (isExistEmail.isExist) {
        return AppResponse.setUserErrorResponse<AddProfileResDto>(
          isExistEmail.message,
        );
      }

      const isValidPassword = Bcrypt.isPasswordValid(account.password);
      if (!isValidPassword) {
        return AppResponse.setUserErrorResponse<AddProfileResDto>(
          ErrorHandler.invalid('Password'),
        );
      }
      const hashPassword = Bcrypt.handleHashPassword(account.password);

      account.password = hashPassword;

      const querryRunner = this._dataSource.createQueryRunner();

      try {
        await querryRunner.connect();
        await querryRunner.startTransaction('SERIALIZABLE');

        const addUserProfileResult = await querryRunner.manager
          .getRepository(User)
          .createQueryBuilder()
          .insert()
          .into(User)
          .values(userData)
          .execute();

        const accountData = {
          ...account,
          userId: addUserProfileResult.identifiers[0].id,
        };
        const addAccountResult = await querryRunner.manager
          .getRepository(Account)
          .createQueryBuilder()
          .insert()
          .into(Account)
          .values(accountData)
          .execute();
        await querryRunner.commitTransaction();

        const data = {
          userId: addUserProfileResult.identifiers[0].id,
          accountId: addAccountResult.identifiers[0].id,
        };

        return AppResponse.setSuccessResponse<AddProfileResDto>(data, {
          status: 201,
          message: 'Created',
        });
      } catch (error) {
        await querryRunner.rollbackTransaction();
        throw error;
      } finally {
        await querryRunner.release();
      }
    } catch (error) {
      return error.detail.includes('departmentId')
        ? AppResponse.setUserErrorResponse<AddProfileResDto>(
            ErrorHandler.notFound('Department'),
            { status: 404 },
          )
        : error.detail.includes('positionId')
        ? AppResponse.setUserErrorResponse<AddProfileResDto>(
            ErrorHandler.notFound('Position'),
            { status: 404 },
          )
        : AppResponse.setAppErrorResponse<AddProfileResDto>(error.message);
    }
  }

  private async isExistUserProfileData(
    dataObject: Object,
  ): Promise<IExistDataReturnValue> {
    const accountTableFields: Array<string> = this._dataSource
      .getMetadata(Account)
      .columns.map((column) => column.propertyName);
    const userTableFields: Array<string> = this._dataSource
      .getMetadata(User)
      .columns.map((column) => column.propertyName);
    try {
      if (accountTableFields.includes(Object.keys(dataObject)[0])) {
        const existUserAccount = await this._dataSource
          .getRepository(Account)
          .find({ where: dataObject });
        if (existUserAccount.length > 0) {
          return {
            isExist: true,
            message: ErrorHandler.alreadyExists(
              Object.getOwnPropertyNames(dataObject).toString(),
            ),
          };
        }
      }
      if (userTableFields.includes(Object.keys(dataObject)[0])) {
        const existUserInfor = await this._dataSource
          .getRepository(User)
          .find({ where: dataObject });
        if (existUserInfor.length > 0) {
          return {
            isExist: true,
            message: ErrorHandler.alreadyExists(
              Object.getOwnPropertyNames(dataObject).toString(),
            ),
          };
        }
      }
      return {
        isExist: false,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAccountProfile(accountId: number): Promise<GetProfileResDto> {
    try {
      const account = await this._dataSource.getRepository(Account).findOne({
        where: { id: accountId },
        relations: ['user', 'role', 'user.department', 'user.position'],
      });
      if (!account)
        return AppResponse.setAppErrorResponse<GetProfileResDto>(
          ErrorHandler.notFound(`Account ${accountId}`),
          {
            status: 400,
          },
        );

      const { phonenumber, user } = account;

      const { id, departmentId, positionId, ...profileData } = {
        ...user,
        phonenumber,
        position: {
          name: user.position.name,
          id: user.position.id,
        },
        department: {
          name: user.department.name,
          id: user.department.id,
        },
        accountId: account.id,
        userId: account.user.id,
        role: {
          name: account.role.name,
          id: account.role.id,
        },
      };

      return AppResponse.setSuccessResponse<GetProfileResDto>(profileData, {
        message: 'Success',
      });
    } catch (error) {
      return AppResponse.setAppErrorResponse(error.message);
    }
  }

  async getUserProfile(userId: number): Promise<GetProfileResDto> {
    try {
      const userProfiles = await this._dataSource
        .getRepository(User)
        .createQueryBuilder('u')
        .innerJoin('u.accounts', 'account')
        .addSelect([
          'account.phonenumber',
          'account.id',
          'account.roleId',
          'account.isActive',
          'account.firstLogin',
        ])
        .where('u.id = :userId', { userId: userId })
        .getOne();

      return AppResponse.setSuccessResponse<GetProfileResDto>(userProfiles, {
        message: 'Success',
      });
    } catch (error) {
      return AppResponse.setAppErrorResponse(error.message);
    }
  }

  async checkEmailAlreadyExists(email: string): Promise<GetProfileResDto> {
    try {
      const profile = await this._dataSource.getRepository(User).findOne({
        where: { email },
      });

      if (profile) {
        return AppResponse.setUserErrorResponse(
          ErrorHandler.alreadyExists(`The email ${email}`),
          {
            data: { emailExists: !!profile },
          },
        );
      }

      return AppResponse.setSuccessResponse<GetProfileResDto>({
        emailExists: !!profile,
      });
    } catch (error) {
      return AppResponse.setAppErrorResponse(error.message);
    }
  }

  async checkPhoneNumberAlreadyExists(
    phonenumber: string,
  ): Promise<GetProfileResDto> {
    try {
      const account = await this._dataSource.getRepository(Account).findOne({
        where: { phonenumber },
      });

      if (account) {
        return AppResponse.setUserErrorResponse(
          ErrorHandler.alreadyExists(`The phone number ${phonenumber}`),
          {
            data: { phonenumberExists: !!account },
          },
        );
      }

      return AppResponse.setSuccessResponse<GetProfileResDto>({
        phonenumberExists: !!account,
      });
    } catch (error) {
      return AppResponse.setAppErrorResponse(error.message);
    }
  }

  async updateProfile(
    accountID: number,
    accountData: IAccountData,
    data: UpdateProfileReqDto,
  ): Promise<UpdateProfileResDto> {
    const userRole = accountData?.payload.role;
    const forbiddenKeys = isProfileUpdateAllowedForUserRole(userRole, data);

    if (forbiddenKeys?.length > 0) {
      return AppResponse.setUserErrorResponse<UpdateProfileResDto>(
        ErrorHandler.notAllow(forbiddenKeys.join(', ')),
      );
    }

    const { roleId, phonenumber, ...rest } = data;

    const userData: IUserPayload = {
      ...rest,
    };

    const account: IAccountPayload = {
      roleId,
      phonenumber,
    };

    try {
      const isHaveAccount = await this._dataSource
        .getRepository(Account)
        .findOneBy({
          id: accountID,
        });

      if (!isHaveAccount) {
        return AppResponse.setAppErrorResponse<UpdateProfileResDto>(
          ErrorHandler.notFound(`Account with id ${accountID}`),
          {
            status: 400,
          },
        );
      }

      const isHaveDepartment = await this._dataSource
        .getRepository(Department)
        .findOneBy({
          id: data.departmentId,
        });

      if (!isHaveDepartment) {
        return AppResponse.setUserErrorResponse<UpdateProfileResDto>(
          ErrorHandler.notFound(`Department with id ${data.departmentId}`),
          {
            status: 400,
          },
        );
      }

      const isHavePosition = await this._dataSource
        .getRepository(Position)
        .findOneBy({
          id: data.positionId,
        });

      if (!isHavePosition) {
        return AppResponse.setUserErrorResponse<UpdateProfileResDto>(
          ErrorHandler.notFound(`Position with id ${data.positionId}`),
          {
            status: 400,
          },
        );
      }

      const isExistEmail = await this._dataSource
        .getRepository(User)
        .findOneBy({
          email: data.email,
        });

      if (isExistEmail && isExistEmail.id !== isHaveAccount.userId) {
        return AppResponse.setUserErrorResponse<UpdateProfileResDto>(
          ErrorHandler.alreadyExists('Email'),
          {
            status: 400,
          },
        );
      }

      const isExistPhoneNumber = await this._dataSource
        .getRepository(Account)
        .findOneBy({
          phonenumber: data.phonenumber,
        });

      if (isExistPhoneNumber && isExistPhoneNumber.id !== accountID) {
        return AppResponse.setUserErrorResponse<UpdateProfileResDto>(
          ErrorHandler.alreadyExists('Phonenumber'),
          {
            status: 400,
          },
        );
      }

      const querryRunner = this._dataSource.createQueryRunner();

      try {
        await querryRunner.connect();
        await querryRunner.startTransaction('SERIALIZABLE');

        const accountUpdateData = await querryRunner.manager
          .getRepository(Account)
          .createQueryBuilder()
          .update(Account)
          .set(account)
          .where('id = :id', { id: accountID })
          .execute();

        const accountAfterUpdate = await this._dataSource
          .getRepository(Account)
          .findOne({ where: { id: accountID } });

        const { ...updatedAccountData } = accountAfterUpdate;

        const user = await querryRunner.manager
          .getRepository(User)
          .createQueryBuilder()
          .update(User)
          .set(userData)
          .where('id = :id', { id: updatedAccountData.userId })
          .execute();

        await querryRunner.commitTransaction();

        const finalResult = {
          ...rest,
          ...account,
          accountId: updatedAccountData.id,
          userId: updatedAccountData.userId,
        };

        return AppResponse.setSuccessResponse<UpdateProfileResDto>(
          finalResult,
          {
            status: 200,
            message: 'Updated',
          },
        );
      } catch (error) {
        await querryRunner.rollbackTransaction();
        throw error;
      } finally {
        await querryRunner.release();
      }
    } catch (error) {
      return AppResponse.setAppErrorResponse<UpdateProfileResDto>(
        error.message,
      );
    }
  }

  async deActivateProfile(userId: number): Promise<UpdateProfileResDto> {
    const querryRunner = this._dataSource.createQueryRunner();
    try {
      await querryRunner.connect();
      await querryRunner.startTransaction('SERIALIZABLE');

      const user = await this._userRepository.findOne({
        where: { id: userId },
      });

      if (!user)
        return AppResponse.setAppErrorResponse<UpdateProfileResDto>(
          ErrorHandler.notFound(`User with id ${userId}`),
          {
            status: 400,
          },
        );

      const account = await this._dataSource
        .getRepository(Account)
        .findOne({ where: { userId: user.id } });

      if (!account)
        return AppResponse.setAppErrorResponse<UpdateProfileResDto>(
          ErrorHandler.notFound(`Account with user id ${userId}`),
          {
            status: 400,
          },
        );

      const userUpdate = await this._dataSource
        .getRepository(User)
        .createQueryBuilder()
        .update(User)
        .set({ isActive: false })
        .where('id = :id', { id: user.id })
        .execute();

      const accountUpdate = await this._dataSource
        .getRepository(Account)
        .createQueryBuilder()
        .update(Account)
        .set({ isActive: false })
        .where('id = :id', { id: account.id })
        .execute();

      await querryRunner.commitTransaction();

      const result = {
        user: userUpdate.affected,
        account: accountUpdate.affected,
      };

      return AppResponse.setSuccessResponse<UpdateProfileResDto>(result, {
        status: 200,
        message: 'User have been Deactivated',
      });
    } catch (error) {
      await querryRunner.rollbackTransaction();
      return AppResponse.setAppErrorResponse<UpdateProfileResDto>(
        error.message,
      );
    } finally {
      await querryRunner.release();
    }
  }

  async activateProfile(userId: number): Promise<UpdateProfileResDto> {
    const querryRunner = this._dataSource.createQueryRunner();
    try {
      await querryRunner.connect();
      await querryRunner.startTransaction('SERIALIZABLE');
      const user = await this._userRepository.findOne({
        where: { id: userId },
      });

      if (!user)
        return AppResponse.setAppErrorResponse<UpdateProfileResDto>(
          ErrorHandler.notFound(`User with id ${userId}`),
          {
            status: 400,
          },
        );

      const account = await this._dataSource
        .getRepository(Account)
        .findOne({ where: { userId: user.id } });

      if (!account)
        return AppResponse.setAppErrorResponse<UpdateProfileResDto>(
          ErrorHandler.notFound(`Account with user id ${userId}`),
          {
            status: 400,
          },
        );

      const userUpdate = await this._dataSource
        .getRepository(User)
        .createQueryBuilder()
        .update(User)
        .set({ isActive: true })
        .where('id = :id', { id: user.id })
        .execute();

      const accountUpdate = await this._dataSource
        .getRepository(Account)
        .createQueryBuilder()
        .update(Account)
        .set({ isActive: true })
        .where('id = :id', { id: account.id })
        .execute();

      await querryRunner.commitTransaction();

      const result = {
        user: userUpdate.affected,
        account: accountUpdate.affected,
      };

      return AppResponse.setSuccessResponse<UpdateProfileResDto>(result, {
        status: 200,
        message: 'User have been Activated',
      });
    } catch (error) {
      await querryRunner.rollbackTransaction();
      return AppResponse.setAppErrorResponse<UpdateProfileResDto>(
        error.message,
      );
    } finally {
      await querryRunner.release();
    }
  }

  async getProfiles(queries: GetProfilesReqDto): Promise<GetProfilesResDto> {
    try {
      const userTableFields: Array<string> = this._dataSource
        .getMetadata(User)
        .columns.map((column) => {
          return column.propertyName;
        });
      const mappingUserFieldType: Array<string> = this._dataSource
        .getMetadata(User)
        .columns.map((column) => {
          return `${column.propertyName}:${column.type}`;
        });

      let query: SelectQueryBuilder<User> = this._dataSource
        .createQueryBuilder()
        .select([
          'user.id',
          'user.fullname',
          'user.gender',
          'user.dateOfBirth',
          'user.address',
          'user.email',
          'user.startDate',
          'user.endDate',
          'user.avatar',
          'user.createdAt',
          'user.isActive',
          'user.citizenId',
          'account.phonenumber',
          'account.id',
          'account.isActive',
          'department.id',
          'department.name',
          'department.isActive',
          'role.roleId',
          'role.name',
          'position.id',
          'position.name',
        ])
        .from(User, 'user')
        .innerJoin(
          'user.department',
          'department',
          'user.departmentId = department.id',
        )
        .innerJoin('user.position', 'position', 'user.positionId = position.id')
        .innerJoin('user.accounts', 'account')
        .innerJoin('account.role', 'role', 'account.roleId = role.roleId');

      query = ExtraQueryBuilder.addWhereAnd<User>(
        query,
        mappingUserFieldType,
        queries,
        'user',
      );

      query = ExtraQueryBuilder.addWhereOr<User>(
        query,
        [
          'user.fullname',
          'user.gender',
          'user.dateOfBirth',
          'user.citizenId',
          'user.email',
          'account.phonenumber',
          'role.name',
          'department.name',
          'user.startDate',
          'user.endDate',
        ],
        queries,
      );
      if (queries.sortBy) {
        if (!userTableFields.includes(queries.sortBy)) {
          return AppResponse.setUserErrorResponse<GetProfilesResDto>(
            ErrorHandler.invalid(queries.sortBy),
          );
        }
        if (queries.sortBy === 'citizenId') {
          return AppResponse.setUserErrorResponse<GetProfilesResDto>(
            ErrorHandler.notAllow(queries.sortBy),
          );
        }
        query.orderBy(
          `user.${queries.sortBy}`,
          queries.order === 'ASC' ? 'ASC' : 'DESC',
        );
      } else {
        query.orderBy('user.createdAt', 'DESC');
      }
      const { fullQuery, pages, nextPage, totalDocs, prevPage } =
        await ExtraQueryBuilder.paginateBy<User>(query, {
          page: queries.page,
          pageSize: queries.pageSize,
        });
      const profiles: IProfile[] = await fullQuery.getMany();
      return AppResponse.setSuccessResponse<GetProfilesResDto>(profiles, {
        page: queries.page,
        pageSize: queries.pageSize,
        totalPages: pages,
        nextPage: nextPage,
        prevPage: prevPage,
        totalDocs: totalDocs,
      });
    } catch (error) {
      return AppResponse.setAppErrorResponse<GetProfilesResDto>(error.message);
    }
  }
}
