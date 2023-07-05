import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IAuthPayload } from '../interfaces';
import { AccountService } from '../services';
import { JWT_ACCESS_SECRET_KEY } from '../../../core/constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly accountService: AccountService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_ACCESS_SECRET_KEY,
    });
  }

  async validate(payload: IAuthPayload) {
    return payload;
  }
}
