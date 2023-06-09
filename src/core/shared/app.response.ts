import { ShareResDto } from './response';

export const AppResponse = {
  setSuccessResponse<T extends ShareResDto>(
    responseObject: T,
    data: Object,
    otherOptions?: T,
  ): void {
    if (otherOptions) {
      Object.keys(otherOptions).forEach((key) => {
        responseObject[key] = otherOptions[key];
      });
    }
    if (!responseObject.hasOwnProperty('version')) {
      responseObject.version = 'v1';
    }
    if (!responseObject.hasOwnProperty('status')) {
      responseObject.status = 200;
    }
    if (!responseObject.hasOwnProperty('message')) {
      responseObject.message = 'Success';
    }
    responseObject.data = data;
  },

  setAppErrorResponse<T extends ShareResDto>(
    responseObject: T,
    exceptionMessage: string,
    otherOptions?: T,
  ): void {
    if (otherOptions) {
      Object.keys(otherOptions).forEach((key) => {
        responseObject[key] = otherOptions[key];
      });
    }
    if (!responseObject.hasOwnProperty('version')) {
      responseObject.version = 'v1';
    }
    if (!responseObject.hasOwnProperty('status')) {
      responseObject.status = 500;
    }
    if (!responseObject.hasOwnProperty('message')) {
      responseObject.message = 'Failed';
    }
    responseObject.exception = exceptionMessage;
  },

  setUserErrorResponse<T extends ShareResDto>(
    responseObject: T,
    exceptionMessage: string,
    otherOptions?: T,
  ): void {
    if (otherOptions) {
      Object.keys(otherOptions).forEach((key) => {
        responseObject[key] = otherOptions[key];
      });
    }
    if (!responseObject.hasOwnProperty('version')) {
      responseObject.version = 'v1';
    }
    if (!responseObject.hasOwnProperty('status')) {
      responseObject.status = 400;
    }
    if (!responseObject.hasOwnProperty('message')) {
      responseObject.message = 'Failed';
    }
    responseObject.exception = exceptionMessage;
  },
};
