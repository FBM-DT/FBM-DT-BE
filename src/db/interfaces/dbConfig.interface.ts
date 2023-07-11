import { DataSourceOptions } from 'typeorm';

export interface IDatabaseConfig {
  development: DataSourceOptions;
  test: DataSourceOptions;
  production: DataSourceOptions;
}

