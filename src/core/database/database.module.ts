import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { databaseConfig } from './database.config';

@Module({
    providers: [...databaseProviders],
    exports: [...databaseProviders],
})
export class DatabaseModule {}