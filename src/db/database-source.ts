import { DataSource, DataSourceOptions } from 'typeorm';
import { DEVELOPMENT, PRODUCTION, TEST } from '../core/constants';
import { databaseConfig } from './database.config';

console.log("🚀 ~ file: database-source.ts:8 ~ typeOrmConfig ~ process.env.NODE_ENV:", process.env.NODE_ENV)

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
console.log("🚀 ~ file: database-source.ts:26 ~ typeOrmConfig ~ typeOrmConfig:", typeOrmConfig)
const config: DataSourceOptions = typeOrmConfig();
const dataSource = new DataSource(config);
export default dataSource;
