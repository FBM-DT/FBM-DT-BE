import { Injectable, Inject, Post } from '@nestjs/common';
import { IUserRepository } from '../../core/abstraction';
import { UserRepository } from './users.provider';
@Injectable()
export class UsersService {
  private _repository: IUserRepository;
  constructor(userRepository: UserRepository) {
    this._repository = userRepository;
  }

  async addUser(data: Object) {
    try {
      const response = await this._repository.add(data);
    } catch (error) {
      console.log(
        '🚀 ~ file: users.service.ts:15 ~ UsersService ~ addUser ~ error:',
        error,
      );
    }
  }
}
