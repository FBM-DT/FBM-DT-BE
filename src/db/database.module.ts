import { Global, Module } from '@nestjs/common';
import { databaseProviders } from './database.provider';
import { DatabaseConfig } from './database.config';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [...databaseProviders, DatabaseConfig],
  exports: [...databaseProviders, DatabaseConfig],
})
export class DatabaseModule {}
