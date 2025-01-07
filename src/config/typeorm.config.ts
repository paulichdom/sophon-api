import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const isTest = this.configService.get('NODE_ENV') === 'test';
    const isDev = this.configService.get('NODE_ENV') === 'development';
    const isProd = this.configService.get('NODE_ENV') === 'production';

    const baseConfig: TypeOrmModuleOptions = {
      type: 'sqlite',
      database: this.configService.get('DB_NAME'),
      autoLoadEntities: true,
      synchronize: isTest || isDev,
      migrationsRun: isTest,
      keepConnectionAlive: isTest,
    };

    if (!isProd) {
      return baseConfig;
    }

    return {
      ...baseConfig,
      type: 'postgres',
      url: this.configService.get('DATABASE_URL'),
    };
  }
}