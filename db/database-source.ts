import { DataSource, DataSourceOptions } from 'typeorm';
import { DEVELOPMENT, PRODUCTION, TEST } from '../src/core/constants';
import { databaseConfig } from './database.config';
export const typeOrmConfig = () => {
  let config: DataSourceOptions;
  switch (process.env.NODE_ENV) {
    case DEVELOPMENT:
      config = databaseConfig.development;
      break;
    case TEST:
      config = databaseConfig.test;
      break;
    case PRODUCTION:
      config = databaseConfig.production;
      break;
    default:
      config = databaseConfig.development;
      break;
  }
  return config;
};
const config: DataSourceOptions = typeOrmConfig();
const dataSource = new DataSource(config);
export default dataSource;
