import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { IAuthPayload } from '../interfaces';
import { AccountService } from '../services';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly accountService: AccountService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET_KEY'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: IAuthPayload) {
    const accessToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, accessToken };
  }
}
