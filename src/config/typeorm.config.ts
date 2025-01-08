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

    const migrationsRun = isTest || isProd;
    const migrationsPath = 'src/database';

    const baseConfig: TypeOrmModuleOptions = {
      type: 'sqlite',
      database: this.configService.get('DB_NAME'),
      autoLoadEntities: true,
      synchronize: isTest || isDev,
      migrationsRun: migrationsRun,
      migrations: migrationsRun
        ? [process.cwd() + `/${migrationsPath}/migrations/*{.js,.ts}`]
        : [],
      keepConnectionAlive: isTest,
      
    };

    if (!isProd) {
      return baseConfig;
    }

    return {
      ...baseConfig,
      type: 'postgres',
      host: this.configService.get('DB_HOST'),
      port: this.configService.get('DB_PORT'),
      username: this.configService.get('DB_USERNAME'),
      password: this.configService.get('DB_PASSWORD'),
      ssl: {
        rejectUnauthorized: false
      }
    };
  }
}