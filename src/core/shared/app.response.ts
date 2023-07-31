import { ShareResDto } from './response';

export const AppResponse = {
  setSuccessResponse<T extends ShareResDto>(data: Object, otherOptions?: T): T {
    let responseObject: T = new Object() as T;
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
    return responseObject;
  },

  setAppErrorResponse<T extends ShareResDto>(
    exceptionMessage: string,
    otherOptions?: T,
  ): T {
    let responseObject: T = new Object() as T;
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
    return responseObject;
  },

  setUserErrorResponse<T extends ShareResDto>(
    exceptionMessage: string,
    otherOptions?: T,
  ): T {
    let responseObject: T = new Object() as T;
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
    return responseObject;
  },
};
