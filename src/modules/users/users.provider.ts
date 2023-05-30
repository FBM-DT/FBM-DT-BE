import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../core/abstraction';
import { User } from './user.entity';
import { DataSource, Repository } from 'typeorm';
import { TYPEORM } from 'src/core/constants';

@Injectable()
export class UserRepository implements IUserRepository {
  private _repository: Repository<User>;
  constructor(
    @Inject(TYPEORM)
    dataSource: DataSource,
  ) {
    this._repository = dataSource.getRepository(User);
  }

  async add(data: Object): Promise<number> {
    try {
      const response = await this._repository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(data)
        .execute();
      return response.identifiers[0].id;
    } catch (error) {
      console.log(
        '🚀 ~ file: user.provider.ts:27 ~ UserRepository ~ add ~ error:',
        error,
      );
    }
  }
  async update(data: Object, id: number): Promise<number> {
    try {
      const response = await this._repository
        .createQueryBuilder('user')
        .update(User)
        .set(data)
        .where('user.id = :userId', { userId: id })
        .execute();
      return response.affected;
    } catch (error) {
      console.log(
        '🚀 ~ file: user.provider.ts:43 ~ UserRepository ~ update ~ error:',
        error,
      );
    }
  }
  async delete(id: number): Promise<number> {
    try {
      const response = await this._repository
        .createQueryBuilder('user')
        .delete()
        .from(User)
        .where('user.id = :userId', { userId: id })
        .execute();
      return response.affected;
    } catch (error) {
      console.log(
        '🚀 ~ file: user.provider.ts:59 ~ UserRepository ~ delete ~ error:',
        error,
      );
    }
  }
  async findAll(): Promise<User[]> {
    try {
      const response: User[] = await this._repository
        .createQueryBuilder('user')
        .getMany();
      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: user.provider.ts:72 ~ UserRepository ~ findAll ~ error:',
        error,
      );
    }
  }
  async findManyByConditions(conditions: Object): Promise<User[]> {
    try {
      const response: User[] = await this._repository.findBy(conditions);
      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: user.provider.ts:83 ~ UserRepository ~ findManyByConditions ~ error:',
        error,
      );
    }
  }
  async findOneById(id: number): Promise<User> {
    try {
      const response: User = await this._repository
        .createQueryBuilder('user')
        .where('user.id = :userId', { userId: id })
        .getOne();
      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: user.provider.ts:97 ~ UserRepository ~ findOneById ~ error:',
        error,
      );
    }
  }
  async findOneByConditions(conditions: Object): Promise<User> {
    try {
      const response: User = await this._repository.findOneBy(conditions);
      return response;
    } catch (error) {
      console.log(
        '🚀 ~ file: user.provider.ts:108 ~ UserRepository ~ findOneByConditions ~ error:',
        error,
      );
    }
  }
}
