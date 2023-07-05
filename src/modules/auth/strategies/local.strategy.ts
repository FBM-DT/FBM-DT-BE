import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services';
import { ValidateAccountResponseDto } from '../dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'phonenumber' });
  }

  async validate(payload: {
    phonenumber: string;
    password: string;
  }): Promise<ValidateAccountResponseDto> {
    try {
      const account = await this.authService.validate(payload);
      if (!account) {
        throw new UnauthorizedException();
      }
      return account;
    } catch (error) {
      if (error.status !== 500) {
        console.log(error.message);
        throw error.message;
      }
      throw new InternalServerErrorException();
    }
  }
}
