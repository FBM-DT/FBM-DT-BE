import { TYPEORM } from '../core/constants';
import dataSource from './database-source';

export const databaseProviders = [
  {
    provide: TYPEORM,
    useFactory: async () => {
      const sourceInitialization = dataSource;
      return sourceInitialization;
    },
  },
];