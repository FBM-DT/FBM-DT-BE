import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { IDatabaseConfig } from './interfaces/dbConfig.interface';
import { DEVELOPMENT, PRODUCTION, TEST } from '../core/constants';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DatabaseConfig {
  constructor(private configService: ConfigService) {}
  getConfig(): DataSourceOptions {
    const setting: IDatabaseConfig = {
      development: {
        type: 'postgres',
        username: this.configService.get<string>('DB_USER'),
        password: this.configService.get<string>('DB_PASS'),
        database: this.configService.get<string>('DB_NAME'),
        host: this.configService.get<string>('DB_HOST'),
        port: parseInt(this.configService.get<string>('DB_PORT')),
        entities: ['dist/**/*.entity{.ts,.js}'],
      },
      production: {
        type: 'postgres',
        username: this.configService.get<string>('DB_USER'),
        password: this.configService.get<string>('DB_PASS'),
        database: this.configService.get<string>('DB_NAME'),
        host: this.configService.get<string>('DB_HOST'),
        port: parseInt(this.configService.get<string>('DB_PORT')),
        entities: ['dist/**/*.entity{.ts,.js}'],
      },
      test: {
        type: 'postgres',
        username: this.configService.get<string>('DB_USER'),
        password: this.configService.get<string>('DB_PASS'),
        database: this.configService.get<string>('DB_NAME'),
        host: this.configService.get<string>('DB_HOST'),
        port: parseInt(this.configService.get<string>('DB_PORT')),
        entities: ['dist/**/*.entity{.ts,.js}'],
      },
    };

    let config: DataSourceOptions;
    switch (this.configService.get<string>('NODE_ENV')) {
      case DEVELOPMENT:
        config = setting.development;
        break;
      case TEST:
        config = setting.test;
        break;
      case PRODUCTION:
        config = setting.production;
        break;
      default:
        config = setting.development;
        break;
    }
    return config;
  }
}
