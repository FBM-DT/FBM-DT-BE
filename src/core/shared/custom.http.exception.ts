import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomHttpException extends HttpException {
  constructor(message: string, httpStatus: HttpStatus) {
    super(message, httpStatus);
  }
}
