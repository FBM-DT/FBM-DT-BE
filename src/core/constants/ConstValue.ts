import * as dotenv from 'dotenv';
dotenv.config();

export const TYPEORM = 'TYPEORM';
export const CONNECTION = 'CONNECTION';
export const DEVELOPMENT = 'development';
export const TEST = 'test';
export const PRODUCTION = 'production';
export const USER_REPOSITORY = 'USER_REPOSITORY';
export const SHIFT_REPOSITORY = 'SHIFT_REPOSITORY';
export const JWT_ACCESS_SECRET_KEY = process.env.JWT_ACCESS_SECRET_KEY;
export const ACCESS_EXPIRES_TIME = process.env.ACCESS_TOKEN_EXPIRATION;
export const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;
export const REFRESH_EXPIRES_TIME = process.env.REFRESH_TOKEN_EXPIRATION;
