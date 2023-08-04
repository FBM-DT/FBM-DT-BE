import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetAccount = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req: Request = context.switchToHttp().getRequest();
    return req.user;
  },
);
