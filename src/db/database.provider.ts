import { DataSource } from 'typeorm';
import { TYPEORM } from '../core/constants';
import { DatabaseConfig } from './database.config';
export const databaseProviders = [
  {
    provide: TYPEORM,
    useFactory: async (databaseConfig: DatabaseConfig) => {
      const sourceInitialization = new DataSource(databaseConfig.getConfig());
      return await sourceInitialization.initialize();
    },
    inject: [DatabaseConfig],
  },
];
